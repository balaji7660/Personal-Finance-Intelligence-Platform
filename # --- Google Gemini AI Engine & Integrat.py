# --- Google Gemini AI Engine & Integration ---
import os
import json
import urllib.request
import urllib.error
import re
from datetime import datetime, timedelta
from functools import wraps
from flask import Flask, request, jsonify, session, render_template, redirect, url_for, flash

try:
    from db import get_conn as get_db_connection
except Exception:
    def get_db_connection():
        import sqlite3
        conn = sqlite3.connect('finsight.db')
        conn.row_factory = sqlite3.Row
        return conn

def inr_format(amount):
    try:
        val = float(amount or 0)
        return f"{val:,.2f}"
    except Exception:
        return "0.00"

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session and 'uid' not in session:
            return redirect(url_for('login_page'))
        return f(*args, **kwargs)
    return decorated_function

def call_gemini_api(api_key, system_instruction, user_prompt):
    if not api_key:
        api_key = os.environ.get('GEMINI_API_KEY', '')

    models_to_try = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
    ]

    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    { "text": f"{system_instruction}\n\nUser Question/Command:\n{user_prompt}" }
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 1000
        }
    }

    req_data = json.dumps(payload).encode('utf-8')

    for model_name in models_to_try:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
            req = urllib.request.Request(
                url,
                data=req_data,
                headers={'Content-Type': 'application/json'}
            )
            with urllib.request.urlopen(req, timeout=12) as response:
                res_body = response.read().decode('utf-8')
                res_json = json.loads(res_body)
                candidates = res_json.get('candidates', [])
                if candidates:
                    parts = candidates[0].get('content', {}).get('parts', [])
                    if parts:
                        return parts[0].get('text', '')
        except urllib.error.HTTPError as e:
            err_body = ''
            try:
                err_body = e.read().decode('utf-8')[:200]
            except Exception:
                pass
            print(f"Gemini API ({model_name}) HTTP {e.code} Error: {err_body}")
        except Exception as e:
            print(f"Gemini API ({model_name}) Call Error:", e)

    return None


def process_ai_command(user_id, user_name, prompt, user_provided_key=None):

    api_key = user_provided_key or session.get('gemini_api_key') or app.config.get('GEMINI_API_KEY') or os.environ.get('GEMINI_API_KEY', '')

    tot_income = 0.0

    tot_expenses = 0.0

    net_balance = 0.0

    savings_rate = 0.0

    active_goals_summary = "None"

    budgets_summary = "None"

    investments_summary = "None"

    try:

        conn = get_db_connection()

        with conn.cursor() as cur:

            cur.execute('SELECT SUM(amount) AS total FROM income WHERE user_id = %s', (user_id,))

            tot_income = float(cur.fetchone()['total'] or 0)

            cur.execute('SELECT SUM(amount) AS total FROM expenses WHERE user_id = %s', (user_id,))

            tot_expenses = float(cur.fetchone()['total'] or 0)

            net_balance = tot_income - tot_expenses

            if tot_income > 0:

                savings_rate = round((net_balance / tot_income * 100), 1)

            cur.execute('SELECT goal_name, target_amount, current_amount FROM goals WHERE user_id = %s AND status = "Active"', (user_id,))

            g_rows = cur.fetchall()

            if g_rows:

                active_goals_summary = ", ".join([f"{r['goal_name']} (Target: ₹{inr_format(r['target_amount'])})" for r in g_rows])

            now = datetime.now()

            cur.execute('SELECT category, limit_amount FROM budget WHERE user_id = %s AND month = %s AND year = %s', (user_id, now.month, now.year))

            b_rows = cur.fetchall()

            if b_rows:

                budgets_summary = ", ".join([f"{r['category']}: ₹{inr_format(r['limit_amount'])}" for r in b_rows])

            cur.execute('SELECT SUM(amount) AS total FROM investments WHERE user_id = %s', (user_id,))

            tot_investments = float(cur.fetchone()['total'] or 0)

            if tot_investments > 0:

                investments_summary = f"Total ₹{inr_format(tot_investments)}"

        conn.close()

    except Exception as me:

        print("Error fetching financial context for AI:", me)

    system_instruction = f"""

You are FinSight AI Assistant — an ultra-intelligent, fast, friendly conversational AI engine powered by Google Gemini, acting with the capabilities of ChatGPT, Gemini, and Claude. You have full grip over the user's financial platform.

USER LIVE FINANCIAL SNAPSHOT:

- User Name: {user_name}

- Total Income: ₹{inr_format(tot_income)}

- Total Expenses: ₹{inr_format(tot_expenses)}

- Net Balance / Savings: ₹{inr_format(net_balance)}

- Savings Rate: {savings_rate}%

- Active Budgets: {budgets_summary}

- Active Goals: {active_goals_summary}

- Total Investments: {investments_summary}

LANGUAGE & CONVERSATIONAL STYLE DIRECTIVE:

1. DEFAULT STARTING LANGUAGE (ENGLISH):
   - Always communicate in clear, friendly ENGLISH by default.
   - Initial greetings, default answers, and summaries must start in ENGLISH.

2. DYNAMIC USER LANGUAGE MIRRORING:
   - Detect and mirror the exact language, dialect, and script used by the user in their input message.
   - If user communicates in English -> Respond in English.
   - If user communicates in Telugu or Teluglish (e.g., "ela unnav", "cheppu"), switch and respond in friendly Telugu/Teluglish.
   - If user communicates in Hindi -> Switch and respond in Hindi.
   - If user asks or instructs to speak in English (e.g., "always speak in english", "speak in english"), switch back to English immediately and continue in English.

3. COMMAND & DATABASE ACTION RULES:
   If the user asks to add, record, set, or delete any financial record (Income, Expense, Budget limit, Goal, Investment), you MUST output a JSON action block on the VERY FIRST LINE of your response in this exact format:

   [[ACTION: {{"type": "ADD_EXPENSE", "amount": 2500, "category": "Groceries", "notes": "grocery run"}}]]
   or
   [[ACTION: {{"type": "ADD_INCOME", "amount": 50000, "source": "Salary", "notes": "monthly salary"}}]]
   or
   [[ACTION: {{"type": "SET_BUDGET", "amount": 15000, "category": "Food & Dining"}}]]
   or
   [[ACTION: {{"type": "ADD_GOAL", "amount": 100000, "goal_name": "Emergency Fund"}}]]
   or
   [[ACTION: {{"type": "ADD_INVESTMENT", "amount": 10000, "source": "Mutual Funds"}}]]
   or
   [[ACTION: {{"type": "DELETE_ALL_INCOME"}}]]
   or
   [[ACTION: {{"type": "DELETE_ALL_EXPENSES"}}]]
   or
   [[ACTION: {{"type": "DELETE_ALL_BUDGETS"}}]]
   or
   [[ACTION: {{"type": "DELETE_ALL_GOALS"}}]]

   Categories supported for Expenses/Budgets: Groceries, Food & Dining, Rent & Housing, Travel & Transport, Shopping, Entertainment, Bills & Utilities, Healthcare, Education, Investment, General.

   If NO database modification is needed, do NOT output any [[ACTION:...]] block.

4. Always answer dynamically and helpfully like ChatGPT and Gemini. Use Markdown formatting.

"""

    gemini_text = call_gemini_api(api_key, system_instruction, prompt)

    if gemini_text:
        action_performed = False
        action_type = None
        card_html = ''

        action_match = re.search(r'\[\[ACTION:\s*(\{.*?\})\s*\]\]', gemini_text, re.DOTALL)
        clean_reply = re.sub(r'\[\[ACTION:\s*\{.*?\}\s*\]\]', '', gemini_text, flags=re.DOTALL).strip()

        if action_match:
            try:
                action_data = json.loads(action_match.group(1))
                act_type = action_data.get('type')
                act_amount = float(action_data.get('amount', 0))

                conn = get_db_connection()
                with conn.cursor() as cur:
                    if act_type == 'ADD_EXPENSE' and act_amount > 0:
                        cat = action_data.get('category', 'General')
                        exp_d = datetime.now().strftime('%Y-%m-%d')
                        notes = action_data.get('notes', prompt)
                        cur.execute('INSERT INTO expenses (user_id, category, amount, expense_date, notes) VALUES (%s, %s, %s, %s, %s)', (user_id, cat, act_amount, exp_d, notes))
                        card_html = f'''<div class="ai-action-card card-expense"><div class="card-icon"><i class="bi bi-cart-check-fill"></i></div><div class="card-details"><span class="card-tag">Expense Added</span><h4>₹{inr_format(act_amount)}</h4><p><strong>Category:</strong> {cat}</p><p><small>Date: {exp_d}</small></p></div></div>'''
                        action_performed = True
                        action_type = 'expense_added'

                    elif act_type == 'ADD_INCOME' and act_amount > 0:
                        src = action_data.get('source', 'Salary')
                        inc_d = datetime.now().strftime('%Y-%m-%d')
                        notes = action_data.get('notes', prompt)
                        cur.execute('INSERT INTO income (user_id, source, amount, income_date, notes) VALUES (%s, %s, %s, %s, %s)', (user_id, src, act_amount, inc_d, notes))
                        card_html = f'''<div class="ai-action-card card-income"><div class="card-icon"><i class="bi bi-wallet-fill"></i></div><div class="card-details"><span class="card-tag">Income Added</span><h4>₹{inr_format(act_amount)}</h4><p><strong>Source:</strong> {src}</p><p><small>Date: {inc_d}</small></p></div></div>'''
                        action_performed = True
                        action_type = 'income_added'

                    elif act_type == 'SET_BUDGET' and act_amount > 0:
                        cat = action_data.get('category', 'General')
                        now = datetime.now()
                        cur.execute('INSERT INTO budget (user_id, category, limit_amount, month, year) VALUES (%s, %s, %s, %s, %s) ON DUPLICATE KEY UPDATE limit_amount = VALUES(limit_amount)', (user_id, cat, act_amount, now.month, now.year))
                        card_html = f'''<div class="ai-action-card card-budget"><div class="card-icon"><i class="bi bi-pie-chart-fill"></i></div><div class="card-details"><span class="card-tag">Budget Set</span><h4>₹{inr_format(act_amount)}</h4><p><strong>Category:</strong> {cat}</p></div></div>'''
                        action_performed = True
                        action_type = 'budget_set'

                    elif act_type == 'ADD_GOAL' and act_amount > 0:
                        g_name = action_data.get('goal_name', 'Savings Goal')
                        cur.execute('INSERT INTO goals (user_id, goal_name, goal_type, target_amount, current_amount, category, priority, status) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)', (user_id, g_name, 'Savings Goal', act_amount, 0.00, 'Personal', 'Medium', 'Active'))
                        card_html = f'''<div class="ai-action-card card-goal"><div class="card-icon"><i class="bi bi-flag-fill"></i></div><div class="card-details"><span class="card-tag">Goal Created</span><h4>{g_name}</h4><p><strong>Target:</strong> ₹{inr_format(act_amount)}</p></div></div>'''
                        action_performed = True
                        action_type = 'goal_added'

                    elif act_type == 'ADD_INVESTMENT' and act_amount > 0:
                        src = action_data.get('source', 'Mutual Funds')
                        inv_d = datetime.now().strftime('%Y-%m-%d')
                        cur.execute('INSERT INTO investments (user_id, source, amount, invest_date, invest_type, notes) VALUES (%s, %s, %s, %s, %s, %s)', (user_id, src, act_amount, inv_d, 'General', prompt))
                        card_html = f'''<div class="ai-action-card card-invest"><div class="card-icon"><i class="bi bi-graph-up-arrow"></i></div><div class="card-details"><span class="card-tag">Investment Added</span><h4>₹{inr_format(act_amount)}</h4><p><strong>Asset:</strong> {src}</p></div></div>'''
                        action_performed = True
                        action_type = 'investment_added'

                    elif act_type in ['DELETE_ALL_INCOME', 'DELETE_INCOME']:
                        cur.execute('DELETE FROM income WHERE user_id = %s', (user_id,))
                        card_html = '''<div class="ai-action-card card-income"><div class="card-icon"><i class="bi bi-trash-fill"></i></div><div class="card-details"><span class="card-tag">Income Cleared</span><h4>Cleared All Income Records</h4></div></div>'''
                        action_performed = True
                        action_type = 'income_deleted'

                    elif act_type in ['DELETE_ALL_EXPENSES', 'DELETE_EXPENSES']:
                        cur.execute('DELETE FROM expenses WHERE user_id = %s', (user_id,))
                        card_html = '''<div class="ai-action-card card-expense"><div class="card-icon"><i class="bi bi-trash-fill"></i></div><div class="card-details"><span class="card-tag">Expenses Cleared</span><h4>Cleared All Expense Records</h4></div></div>'''
                        action_performed = True
                        action_type = 'expense_deleted'

                    elif act_type in ['DELETE_ALL_BUDGETS', 'DELETE_BUDGETS']:
                        cur.execute('DELETE FROM budget WHERE user_id = %s', (user_id,))
                        card_html = '''<div class="ai-action-card card-budget"><div class="card-icon"><i class="bi bi-trash-fill"></i></div><div class="card-details"><span class="card-tag">Budgets Cleared</span><h4>Cleared All Budget Limits</h4></div></div>'''
                        action_performed = True
                        action_type = 'budget_deleted'

                    elif act_type in ['DELETE_ALL_GOALS', 'DELETE_GOALS']:
                        cur.execute('DELETE FROM goals WHERE user_id = %s', (user_id,))
                        card_html = '''<div class="ai-action-card card-goal"><div class="card-icon"><i class="bi bi-trash-fill"></i></div><div class="card-details"><span class="card-tag">Goals Cleared</span><h4>Cleared All Financial Goals</h4></div></div>'''
                        action_performed = True
                        action_type = 'goal_deleted'

                conn.close()
            except Exception as ae:
                print("Error parsing/executing Gemini action:", ae)

        # --- If Gemini responded but produced NO action block, run local intent
        # engine to ensure DB actions always happen for clear commands ---
        if not action_performed:
            prompt_lower_check = prompt.lower()
            def _extract_amt(text):
                mk = re.search(r'(\d+(?:\.\d+)?)\s*k\b', text)
                if mk: return float(mk.group(1)) * 1000
                ml = re.search(r'(\d+(?:\.\d+)?)\s*(?:l|lakh|lakhs)\b', text)
                if ml: return float(ml.group(1)) * 100000
                mn = re.search(r'(?:rs\.?|rupees|₹)?\s*(\d+(?:,\d+)*(?:\.\d+)?)', text)
                if mn: return float(mn.group(1).replace(',', ''))
                return None
            fallback_amount = _extract_amt(prompt_lower_check)
            _categories_map = {
                'groceries': 'Groceries', 'grocery': 'Groceries',
                'food': 'Food & Dining', 'dining': 'Food & Dining', 'restaurant': 'Food & Dining',
                'rent': 'Rent & Housing', 'travel': 'Travel & Transport', 'cab': 'Travel & Transport',
                'shopping': 'Shopping', 'entertainment': 'Entertainment',
                'utilities': 'Bills & Utilities', 'health': 'Healthcare', 'education': 'Education'
            }
            try:
                if any(k in prompt_lower_check for k in ['add income', 'received', 'earned', 'got salary', 'salary of', 'bonus', 'income of', 'income']) and fallback_amount and fallback_amount > 0:
                    src = 'Bonus' if 'bonus' in prompt_lower_check else ('Freelance' if 'freelance' in prompt_lower_check else 'Salary')
                    inc_d = datetime.now().strftime('%Y-%m-%d')
                    conn = get_db_connection()
                    with conn.cursor() as cur:
                        cur.execute('INSERT INTO income (user_id, source, amount, income_date, notes) VALUES (%s, %s, %s, %s, %s)', (user_id, src, fallback_amount, inc_d, prompt))
                    conn.close()
                    card_html = f'<div class="ai-action-card card-income"><div class="card-icon"><i class="bi bi-wallet-fill"></i></div><div class="card-details"><span class="card-tag">Income Added</span><h4>₹{inr_format(fallback_amount)}</h4><p><strong>Source:</strong> {src}</p></div></div>'
                    action_performed = True
                    action_type = 'income_added'
                elif any(k in prompt_lower_check for k in ['spent', 'paid', 'bought', 'add expense', 'expense of', 'expense']) and fallback_amount and fallback_amount > 0:
                    cat = 'General'
                    for kw, cv in _categories_map.items():
                        if kw in prompt_lower_check: cat = cv; break
                    exp_d = datetime.now().strftime('%Y-%m-%d')
                    conn = get_db_connection()
                    with conn.cursor() as cur:
                        cur.execute('INSERT INTO expenses (user_id, category, amount, expense_date, notes) VALUES (%s, %s, %s, %s, %s)', (user_id, cat, fallback_amount, exp_d, prompt))
                    conn.close()
                    card_html = f'<div class="ai-action-card card-expense"><div class="card-icon"><i class="bi bi-cart-check-fill"></i></div><div class="card-details"><span class="card-tag">Expense Added</span><h4>₹{inr_format(fallback_amount)}</h4><p><strong>Category:</strong> {cat}</p></div></div>'
                    action_performed = True
                    action_type = 'expense_added'
                elif any(k in prompt_lower_check for k in ['set budget', 'budget for', 'budget of', 'budget limit']) and fallback_amount and fallback_amount > 0:
                    cat = 'General'
                    for kw, cv in _categories_map.items():
                        if kw in prompt_lower_check: cat = cv; break
                    now_dt = datetime.now()
                    conn = get_db_connection()
                    with conn.cursor() as cur:
                        cur.execute('INSERT INTO budget (user_id, category, limit_amount, month, year) VALUES (%s, %s, %s, %s, %s) ON DUPLICATE KEY UPDATE limit_amount = VALUES(limit_amount)', (user_id, cat, fallback_amount, now_dt.month, now_dt.year))
                    conn.close()
                    card_html = f'<div class="ai-action-card card-budget"><div class="card-icon"><i class="bi bi-pie-chart-fill"></i></div><div class="card-details"><span class="card-tag">Budget Set</span><h4>₹{inr_format(fallback_amount)}</h4><p><strong>Category:</strong> {cat}</p></div></div>'
                    action_performed = True
                    action_type = 'budget_set'
            except Exception as fe:
                print("Gemini fallback local DB action error:", fe)

        return {
            'status': 'success',
            'reply': clean_reply,
            'card_html': card_html,
            'action_performed': action_performed,
            'action_type': action_type,
            'powered_by': 'Google Gemini AI 🤖'
        }

    # Fallback to local Intent engine
    prompt_lower = prompt.lower()

    def extract_amount(text):
        m_k = re.search(r'(\d+(?:\.\d+)?)\s*k\b', text)
        if m_k: return float(m_k.group(1)) * 1000
        m_l = re.search(r'(\d+(?:\.\d+)?)\s*(?:l|lakh|lakhs)\b', text)
        if m_l: return float(m_l.group(1)) * 100000
        m_num = re.search(r'(?:rs\.?|rupees|₹)?\s*(\d+(?:,\d+)*(?:\.\d+)?)', text)
        if m_num: return float(m_num.group(1).replace(',', ''))
        return None

    categories_map = {
        'groceries': 'Groceries', 'grocery': 'Groceries',
        'food': 'Food & Dining', 'dining': 'Food & Dining', 'restaurant': 'Food & Dining', 'dinner': 'Food & Dining',
        'rent': 'Rent & Housing', 'travel': 'Travel & Transport', 'cab': 'Travel & Transport', 'shopping': 'Shopping',
        'entertainment': 'Entertainment', 'utilities': 'Bills & Utilities', 'health': 'Healthcare', 'education': 'Education'
    }

    amount = extract_amount(prompt_lower)

    # Deletion Fallback Intent
    if any(k in prompt_lower for k in ['delete all income', 'clear income', 'remove income', 'delete income']):
        try:
            conn = get_db_connection()
            with conn.cursor() as cur:
                cur.execute('DELETE FROM income WHERE user_id = %s', (user_id,))
            conn.close()
            card_html = '''<div class="ai-action-card card-income"><div class="card-icon"><i class="bi bi-trash-fill"></i></div><div class="card-details"><span class="card-tag">Income Cleared</span><h4>Cleared All Income Records</h4></div></div>'''
            return {'status': 'success', 'reply': f"Cleared all income records for **{user_name}**.", 'card_html': card_html, 'action_performed': True, 'action_type': 'income_deleted'}
        except Exception as e:
            return {'status': 'error', 'reply': f"Failed to clear income: {str(e)}"}

    if any(k in prompt_lower for k in ['delete all expense', 'delete all expenses', 'clear expenses', 'remove expenses', 'delete expenses']):
        try:
            conn = get_db_connection()
            with conn.cursor() as cur:
                cur.execute('DELETE FROM expenses WHERE user_id = %s', (user_id,))
            conn.close()
            card_html = '''<div class="ai-action-card card-expense"><div class="card-icon"><i class="bi bi-trash-fill"></i></div><div class="card-details"><span class="card-tag">Expenses Cleared</span><h4>Cleared All Expense Records</h4></div></div>'''
            return {'status': 'success', 'reply': f"Cleared all expense records for **{user_name}**.", 'card_html': card_html, 'action_performed': True, 'action_type': 'expense_deleted'}
        except Exception as e:
            return {'status': 'error', 'reply': f"Failed to clear expenses: {str(e)}"}

    if any(k in prompt_lower for k in ['spent', 'paid', 'bought', 'add expense', 'expense of', 'expense']):
        if amount is not None and amount > 0:
            category = 'General'
            for key, cat_val in categories_map.items():
                if key in prompt_lower: category = cat_val; break
            exp_date = datetime.now().strftime('%Y-%m-%d')
            try:
                conn = get_db_connection()
                with conn.cursor() as cur:
                    cur.execute('INSERT INTO expenses (user_id, category, amount, expense_date, notes) VALUES (%s, %s, %s, %s, %s)', (user_id, category, amount, exp_date, prompt))
                conn.close()
                card_html = f'''<div class="ai-action-card card-expense"><div class="card-icon"><i class="bi bi-cart-check-fill"></i></div><div class="card-details"><span class="card-tag">Expense Added</span><h4>₹{inr_format(amount)}</h4><p><strong>Category:</strong> {category}</p><p><small>Date: {exp_date}</small></p></div></div>'''
                return {
                    'status': 'success',
                    'reply': f"Recorded an expense of **₹{inr_format(amount)}** under **{category}**.",
                    'card_html': card_html,
                    'action_performed': True,
                    'action_type': 'expense_added'
                }
            except Exception as e:
                return {'status': 'error', 'reply': f"Failed to record expense: {str(e)}"}

    if any(k in prompt_lower for k in ['add income', 'received', 'earned', 'got salary', 'salary of', 'bonus', 'income of']):
        if amount is not None and amount > 0:
            source = 'Salary'
            if 'bonus' in prompt_lower: source = 'Bonus'
            elif 'freelance' in prompt_lower: source = 'Freelance'
            inc_date = datetime.now().strftime('%Y-%m-%d')
            try:
                conn = get_db_connection()
                with conn.cursor() as cur:
                    cur.execute('INSERT INTO income (user_id, source, amount, income_date, notes) VALUES (%s, %s, %s, %s, %s)', (user_id, source, amount, inc_date, prompt))
                conn.close()
                card_html = f'''<div class="ai-action-card card-income"><div class="card-icon"><i class="bi bi-wallet-fill"></i></div><div class="card-details"><span class="card-tag">Income Added</span><h4>₹{inr_format(amount)}</h4><p><strong>Source:</strong> {source}</p><p><small>Date: {inc_date}</small></p></div></div>'''
                return {
                    'status': 'success',
                    'reply': f"Added **₹{inr_format(amount)}** income from **{source}**.",
                    'card_html': card_html,
                    'action_performed': True,
                    'action_type': 'income_added'
                }
            except Exception as e:
                return {'status': 'error', 'reply': f"Failed to add income: {str(e)}"}

    if any(k in prompt_lower for k in ['summary', 'report', 'total income', 'balance', 'status', 'overview', 'details']):
        summary_text = f"Here is your live financial snapshot, **{user_name}**:\n\n" \
                       f"• **Total Income:** ₹{inr_format(tot_income)}\n" \
                       f"• **Total Expenses:** ₹{inr_format(tot_expenses)}\n" \
                       f"• **Net Balance:** ₹{inr_format(net_balance)}\n" \
                       f"• **Savings Rate:** {savings_rate}%"
        return {'status': 'success', 'reply': summary_text}

    if any(k in prompt_lower for k in ['hlo', 'hello', 'hi', 'hey', 'greetings', 'namaste']):
        return {'status': 'success', 'reply': f"Hello **{user_name}**! 👋 How can I assist you with your finances today? You can ask me to record income, add expenses, check balance, or manage budgets!"}

    if any(k in prompt_lower for k in ['ela unnav', 'cheppu', 'bavunnava', 'katha', 'enti']):
        return {'status': 'success', 'reply': f"Namaste **{user_name}**! Nenu chala bagunnanu. Meeku financial reporting mariyu budget tracking lo ela sahayam cheyamantaru?"}

    reply_msg = f"Hello **{user_name}**! 👋 How can I assist you with your financial management today? You can ask me about your income, expenses, budgets, or savings goals!"
    return {'status': 'success', 'reply': reply_msg}

@app.route('/api/save-gemini-key', methods=['POST'])

@login_required

def save_gemini_key():

    data = request.get_json() or {}

    api_key = data.get('api_key', '').strip()

    session['gemini_api_key'] = api_key

    return jsonify({'status': 'success', 'message': 'Gemini API Key saved successfully!'})

@app.route('/api/ai-chat', methods=['POST'])

@login_required

def ai_chat_assistant():

    data = request.get_json() or {}

    user_msg = data.get('message', '').strip()

    user_key = data.get('api_key', '').strip()

    user_id = session.get('user_id')

    user_name = session.get('user_name', 'User')

    if not user_msg:

        return jsonify({'status': 'error', 'reply': 'Please type a message.'}), 400

    try:

        response_payload = process_ai_command(user_id, user_name, user_msg, user_provided_key=user_key)

    except Exception as route_err:

        import traceback
        print("AI Chat Route Error:", traceback.format_exc())

        response_payload = {
            'status': 'error',
            'reply': '⚠️ Something went wrong processing your request. Please try again or refresh the page.'
        }

    return jsonify(response_payload)

@app.route('/logout')

@login_required

# Logs out the user

def logout():

    session.clear()

    flash('You have been logged out successfully.', 'info')

    return redirect(url_for('home'))

@app.route('/budget')

@login_required

# Alias for budget view

def budget():

    user_name = session.get('user_name', 'User')

    user_email = session.get('user_email', '')

    return render_template('dashboard.html', user_name=user_name, user_email=user_email)

@app.route('/forgot-password')

# Forgot password link

def forgot_password():

    flash('Password reset feature coming soon. Contact support for help.', 'info')

    return redirect(url_for('login_page'))

@app.route('/api/dashboard-summary')

@login_required

# API: gets dashboard stats

def api_dashboard_summary():

    user_id = session.get('user_id')

    try:

        conn = get_db_connection()

        with conn.cursor() as cur:

            cur.execute('SELECT COALESCE(SUM(amount), 0) AS total FROM income WHERE user_id = %s', (user_id,))

            total_income = float(cur.fetchone()['total'])

            cur.execute('SELECT COALESCE(SUM(amount), 0) AS total FROM expenses WHERE user_id = %s', (user_id,))

            total_expenses = float(cur.fetchone()['total'])

            cur.execute('SELECT COALESCE(SUM(amount), 0) AS total FROM investments WHERE user_id = %s', (user_id,))

            total_investments = float(cur.fetchone()['total'])

        conn.close()

        total_savings = min(total_income * 0.25, max(0, total_income - total_expenses - total_investments))

        remaining_balance = max(0, total_income - total_expenses - total_investments - total_savings)

        

        if total_income > 0:

            expenses_pct = round(total_expenses / total_income * 100)

            savings_pct = round(total_savings / total_income * 100)

            investments_pct = round(total_investments / total_income * 100)

            remaining_pct = max(0, 100 - expenses_pct - savings_pct - investments_pct)

        else:

            expenses_pct = savings_pct = investments_pct = remaining_pct = 0

            

        prev_month = datetime.now().replace(day=1) - timedelta(days=1)

        try:

            conn2 = get_db_connection()

            with conn2.cursor() as cur:

                cur.execute('SELECT COALESCE(SUM(amount),0) AS t FROM income WHERE user_id=%s AND MONTH(income_date)=MONTH(CURDATE()) AND YEAR(income_date)=YEAR(CURDATE())', (user_id,))

                cur_income = float(cur.fetchone()['t'])

                cur.execute('SELECT COALESCE(SUM(amount),0) AS t FROM income WHERE user_id=%s AND MONTH(income_date)=%s AND YEAR(income_date)=%s', (user_id, prev_month.month, prev_month.year))

                prev_income = float(cur.fetchone()['t'])

                cur.execute('SELECT COALESCE(SUM(amount),0) AS t FROM expenses WHERE user_id=%s AND MONTH(expense_date)=MONTH(CURDATE()) AND YEAR(expense_date)=YEAR(CURDATE())', (user_id,))

                cur_expenses = float(cur.fetchone()['t'])

                cur.execute('SELECT COALESCE(SUM(amount),0) AS t FROM expenses WHERE user_id=%s AND MONTH(expense_date)=%s AND YEAR(expense_date)=%s', (user_id, prev_month.month, prev_month.year))

                prev_expenses = float(cur.fetchone()['t'])

                cur.execute('SELECT COALESCE(SUM(amount),0) AS t FROM investments WHERE user_id=%s AND MONTH(invest_date)=MONTH(CURDATE()) AND YEAR(invest_date)=YEAR(CURDATE())', (user_id,))

                cur_invest = float(cur.fetchone()['t'])

                cur.execute('SELECT COALESCE(SUM(amount),0) AS t FROM investments WHERE user_id=%s AND MONTH(invest_date)=%s AND YEAR(invest_date)=%s', (user_id, prev_month.month, prev_month.year))

                prev_invest = float(cur.fetchone()['t'])

            conn2.close()

            def pct_change(cur_val, prev_val):

                if prev_val > 0:

                    return round((cur_val - prev_val) / prev_val * 100, 1)

                return 0

            income_change = pct_change(cur_income, prev_income)

            expenses_change = pct_change(cur_expenses, prev_expenses)

            invest_change = pct_change(cur_invest, prev_invest)

            cur_savings = min(cur_income * 0.25, max(0, cur_income - cur_expenses - cur_invest))

            prev_savings = min(prev_income * 0.25, max(0, prev_income - prev_expenses - prev_invest))

            savings_change = pct_change(cur_savings, prev_savings)

        except:

            income_change = expenses_change = savings_change = invest_change = 0

        return jsonify({

            'income':      {'total': total_income,      'change': income_change},

            'expenses':    {'total': total_expenses,    'change': expenses_change},

            'savings':     {'total': total_savings,     'change': savings_change},

            'investments': {'total': total_investments, 'change': invest_change},

            'remaining':   {'total': remaining_balance},

            'chart_segments': {

                'expenses': expenses_pct,

                'savings': savings_pct,

                'investments': investments_pct,

                'remaining': remaining_pct

            }

        })

    except Exception as e:

        return (jsonify({'error': str(e)}), 500)

@app.route('/api/user-profile')

@login_required

# API: gets user profile

def api_user_profile():

    return jsonify({'name': session.get('user_name', 'User'), 'email': session.get('user_email', ''), 'role': 'Premium User', 'member_since': 'Active', 'account_status': 'Verified', 'financial_health_score': 100})

@app.route('/api/recent-transactions')

@login_required

# API: gets recent transactions

def api_recent_transactions():

    user_id = session.get('user_id')

    try:

        conn = get_db_connection()

        with conn.cursor() as cur:

            cur.execute("SELECT id, source AS title, 'Income' AS category, amount, income_date AS date, 'income' AS type, created_at FROM income WHERE user_id = %s", (user_id,))

            incomes = cur.fetchall()

            cur.execute("SELECT id, category AS title, 'Expense' AS category, amount, expense_date AS date, 'expense' AS type, created_at FROM expenses WHERE user_id = %s", (user_id,))

            expenses = cur.fetchall()

            cur.execute("SELECT id, source AS title, invest_type AS category, amount, invest_date AS date, 'investment' AS type, created_at FROM investments WHERE user_id = %s", (user_id,))

            investments = cur.fetchall()

        conn.close()

        transactions = list(incomes) + list(expenses) + list(investments)

        transactions.sort(key=lambda x: str(x.get('created_at') or x.get('date') or ''), reverse=True)

        recent = transactions[:8]

        result = []

        for t in recent:

            result.append({'title': t['title'], 'category': t['category'], 'amount': float(t['amount']), 'type': t['type'], 'date': str(t['date'])})

        return jsonify(result)

    except Exception as e:

        return (jsonify({'error': str(e)}), 500)

@app.route('/api/monthly-spending')

@login_required

# API: gets monthly spending data

def api_monthly_spending():

    user_id = session.get('user_id')

    try:

        conn = get_db_connection()

        with conn.cursor() as cur:

            cur.execute('''

                SELECT MONTHNAME(expense_date) AS month, SUM(amount) AS total 

                FROM expenses 

                WHERE user_id = %s AND expense_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)

                GROUP BY month 

                ORDER BY MIN(expense_date) ASC

            ''', (user_id,))

            rows = cur.fetchall()

        conn.close()

        labels = [r['month'][:3] for r in rows] if rows else ['No Data']

        values = [float(r['total']) for r in rows] if rows else [0]

        return jsonify({'labels': labels, 'values': values})

    except Exception as e:

        return (jsonify({'error': str(e)}), 500)

@app.route('/api/insights')

@login_required

# API: gets smart insights

def api_insights():

    user_id = session.get('user_id')

    try:

        conn = get_db_connection()

        with conn.cursor() as cur:

            cur.execute('SELECT COALESCE(SUM(amount), 0) AS total FROM expenses WHERE user_id = %s AND MONTH(expense_date) = MONTH(CURDATE()) AND YEAR(expense_date) = YEAR(CURDATE())', (user_id,))

            monthly_spent = float(cur.fetchone()['total'])

            cur.execute('SELECT COALESCE(SUM(limit_amount), 0) AS total_budget FROM budget WHERE user_id = %s AND month = MONTH(CURDATE()) AND year = YEAR(CURDATE())', (user_id,))

            total_budget = float(cur.fetchone()['total_budget'])

            cur.execute('SELECT COALESCE(SUM(amount), 0) AS total FROM income WHERE user_id = %s AND MONTH(income_date) = MONTH(CURDATE()) AND YEAR(income_date) = YEAR(CURDATE())', (user_id,))

            monthly_income = float(cur.fetchone()['total'])

        conn.close()

        if total_budget > 0:

            budget_pct = min(100, round(monthly_spent / total_budget * 100))

            if budget_pct > 100:

                budget_status = 'Over Budget'

                budget_desc = f'Spending is {budget_pct - 100}% over plan'

                budget_color = '#EF4444'

            else:

                budget_status = 'On Track'

                budget_desc = f'Spending is {100 - budget_pct}% below plan'

                budget_color = '#2563EB'

        else:

            budget_pct = 0

            budget_status = 'No Budget Set'

            budget_desc = 'Create a budget to track spending'

            budget_color = '#94A3B8'

        if monthly_income > 0:

            savings = max(0, monthly_income - monthly_spent)

            savings_rate = round(savings / monthly_income * 100)

            savings_status = f'{savings_rate}% Saved'

            savings_desc = 'Savings rate this month'

        else:

            savings_rate = 0

            savings_status = '0% Saved'

            savings_desc = 'No income recorded this month'

        return jsonify([{'title': 'Budget Status', 'status': budget_status, 'description': budget_desc, 'percentage': budget_pct, 'color': budget_color}, {'title': 'Savings Rate', 'status': savings_status, 'description': savings_desc, 'percentage': savings_rate, 'color': '#10B981'}, {'title': 'Investment Growth', 'status': '+0%', 'description': 'Tracking coming soon', 'percentage': 0, 'color': '#8B5CF6'}, {'title': 'Monthly Spending', 'status': f'₹{monthly_spent:,.0f}', 'description': 'Total spent this month', 'percentage': min(100, monthly_spent / max(1, monthly_income) * 100) if monthly_income > 0 else 0, 'color': '#3B82F6'}])

    except Exception as e:

        return (jsonify({'error': str(e)}), 500)

@app.route('/view-all')

@login_required

# Placeholder: view transactions

def view_all():

    return jsonify({'message': 'Recent transactions view is ready for the next step.'})

@app.route('/view-detailed-report')

@login_required

# Placeholder: view reports

def view_detailed_report():

    return jsonify({'message': 'The detailed report page is ready to be expanded.'})

@app.route('/quick-actions/expense')

@login_required

# Placeholder: add expense

def quick_action_expense():

    return jsonify({'message': 'Expense tracking action placeholder'})

@app.route('/quick-actions/budget')

@login_required

# Placeholder: add budget

def quick_action_budget():

    return jsonify({'message': 'Budget creation action placeholder'})

@app.route('/quick-actions/investment')

@login_required

# Placeholder: add investment

def quick_action_investment():

    return jsonify({'message': 'Investment entry action placeholder'})

@app.route('/quick-actions/report')

@login_required

# Placeholder: get reports

def quick_action_report():

    return jsonify({'message': 'Report generation action placeholder'})

@app.route('/api/income', methods=['GET'])

@login_required

# API: gets income list

def api_get_income():

    user_id = session.get('user_id')

    try:

        conn = get_db_connection()

        with conn.cursor() as cur:

            cur.execute('SELECT id, source, amount, income_date, notes, created_at FROM income WHERE user_id = %s ORDER BY created_at DESC', (user_id,))

            rows = cur.fetchall()

        conn.close()

        result = []

        for row in rows:

            result.append({'id': row['id'], 'source': row['source'], 'amount': float(row['amount']), 'income_date': str(row['income_date']), 'notes': row['notes'], 'created_at': str(row['created_at'])})

        return (jsonify(result), 200)

    except Exception as e:

        return (jsonify({'error': str(e)}), 500)

@app.route('/api/income', methods=['POST'])

@login_required

# API: adds new income

def api_create_income():

    data = request.get_json()

    required = ['source', 'amount', 'income_date']

    if not all((k in data for k in required)):

        return (jsonify({'error': f'Missing required fields: {required}'}), 400)

    user_id = session.get('user_id')

    try:

        conn = get_db_connection()

        with conn.cursor() as cur:

            cur.execute('INSERT INTO income (user_id, source, amount, income_date, notes) VALUES (%s, %s, %s, %s, %s)', (user_id, data['source'], data['amount'], data['income_date'], data.get('notes', '')))

            new_id = cur.lastrowid

        conn.close()

        return (jsonify({'id': new_id, 'message': 'Income record created successfully'}), 201)

    except Exception as e:

        return (jsonify({'error': str(e)}), 500)

@app.route('/api/expenses', methods=['GET'])

@login_required

# API: gets expense list

def api_get_expenses():

    user_id = session.get('user_id')

    try:

        conn = get_db_connection()

        with conn.cursor() as cur:

            cur.execute('SELECT id, category, amount, expense_date, notes, created_at FROM expenses WHERE user_id = %s ORDER BY created_at DESC', (user_id,))

            rows = cur.fetchall()

        conn.close()

        result = []

        for row in rows:

            result.append({'id': row['id'], 'category': row['category'], 'amount': float(row['amount']), 'expense_date': str(row['expense_date']), 'notes': row['notes'], 'created_at': str(row['created_at'])})

        return (jsonify(result), 200)

    except Exception as e:

        return (jsonify({'error': str(e)}), 500)

@app.route('/api/expenses', methods=['POST'])

@login_required

# API: adds new expense

def api_create_expense():

    data = request.get_json()

    required = ['category', 'amount', 'expense_date']

    if not all((k in data for k in required)):

        return (jsonify({'error': f'Missing required fields: {required}'}), 400)

    user_id = session.get('user_id')

    try:

        conn = get_db_connection()

        with conn.cursor() as cur:

            cur.execute('INSERT INTO expenses (user_id, category, amount, expense_date, notes) VALUES (%s, %s, %s, %s, %s)', (user_id, data['category'], data['amount'], data['expense_date'], data.get('notes', '')))

            new_id = cur.lastrowid

        conn.close()

        return (jsonify({'id': new_id, 'message': 'Expense record created successfully'}), 201)

    except Exception as e:

        return (jsonify({'error': str(e)}), 500)

@app.route('/api/budget', methods=['GET'])

@login_required

# API: gets budget list

def api_get_budget():

    user_id = session.get('user_id')

    try:

        conn = get_db_connection()

        with conn.cursor() as cur:

            cur.execute('SELECT id, category, limit_amount, month, year, created_at FROM budget WHERE user_id = %s ORDER BY year DESC, month DESC', (user_id,))

            rows = cur.fetchall()

        conn.close()

        result = []

        for row in rows:

            result.append({'id': row['id'], 'category': row['category'], 'limit_amount': float(row['limit_amount']), 'month': row['month'], 'year': row['year'], 'created_at': str(row['created_at'])})

        return (jsonify(result), 200)

    except Exception as e:

        return (jsonify({'error': str(e)}), 500)

@app.route('/api/budget', methods=['POST'])

@login_required

# API: adds new budget

def api_create_budget():

    data = request.get_json()

    required = ['category', 'limit_amount', 'month', 'year']

    if not all((k in data for k in required)):

        return (jsonify({'error': f'Missing required fields: {required}'}), 400)

    user_id = session.get('user_id')

    try:

        conn = get_db_connection()

        with conn.cursor() as cur:

            cur.execute('INSERT INTO budget (user_id, category, limit_amount, month, year) VALUES (%s, %s, %s, %s, %s)', (user_id, data['category'], data['limit_amount'], data['month'], data['year']))

            new_id = cur.lastrowid

        conn.close()

        return (jsonify({'id': new_id, 'message': 'Budget record created successfully'}), 201)

    except Exception as e:

        return (jsonify({'error': str(e)}), 400)

@app.route('/finances')
@login_required
def finances():
    tab = request.args.get('tab', 'income').strip().lower()
    if tab not in ['income', 'expense', 'budget']:
        tab = 'income'

    active_goals = []
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT id, goal_name, category FROM goals WHERE user_id=%s AND status='Active' ORDER BY goal_name ASC", (session.get('user_id'),))
            active_goals = cur.fetchall()
        conn.close()
    except Exception:
        pass

    return render_template('finances.html', tab=tab, user_name=session.get('user_name', 'User'), active_goals=active_goals)

@app.route('/add-income', methods=['GET', 'POST'])
@login_required
# Form page: adds income
def add_income():
    if request.method == 'GET':
        return redirect(url_for('finances', tab='income'))

    error = None
    if request.method == 'POST':
        source = request.form.get('source', '').strip()
        amount_str = request.form.get('amount', '').strip()
        income_date = request.form.get('income_date', '').strip()
        notes = request.form.get('notes', '').strip()

        if not source or not amount_str or not income_date:
            error = 'Source, Amount, and Date are required fields.'
        else:
            try:
                amount = float(amount_str)
                if amount <= 0:
                    error = 'Amount must be a positive number greater than zero.'
            except ValueError:
                error = 'Please enter a valid numeric amount.'

        if not error:
            try:
                conn = get_db_connection()
                with conn.cursor() as cur:
                    cur.execute('INSERT INTO income (user_id, source, amount, income_date, notes) VALUES (%s, %s, %s, %s, %s)', (session.get('user_id'), source, amount, income_date, notes))
                conn.close()
                flash('Income record added successfully!', 'success')
                return redirect(url_for('finances', tab='income'))
            except Exception as e:
                error = f'Database error: {str(e)}'

    active_goals = []
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT id, goal_name, category FROM goals WHERE user_id=%s AND status='Active' ORDER BY goal_name ASC", (session.get('user_id'),))
            active_goals = cur.fetchall()
        conn.close()
    except Exception:
        pass

    return render_template('finances.html', tab='income', error=error, user_name=session.get('user_name', 'User'), active_goals=active_goals)

@app.route('/add-expense', methods=['GET', 'POST'])
@login_required
# Form page: adds expense
def add_expense():
    if request.method == 'GET':
        return redirect(url_for('finances', tab='expense'))

    error = None
    if request.method == 'POST':
        category = request.form.get('category', '').strip()
        amount_str = request.form.get('amount', '').strip()
        expense_date = request.form.get('expense_date', '').strip()
        notes = request.form.get('notes', '').strip()

        if not category or not amount_str or not expense_date:
            error = 'Category, Amount, and Date are required fields.'
        else:
            try:
                amount = float(amount_str)
                if amount <= 0:
                    error = 'Amount must be a positive number greater than zero.'
            except ValueError:
                error = 'Please enter a valid numeric amount.'

        if not error:
            try:
                conn = get_db_connection()
                with conn.cursor() as cur:
                    cur.execute('INSERT INTO expenses (user_id, category, amount, expense_date, notes) VALUES (%s, %s, %s, %s, %s)', (session.get('user_id'), category, amount, expense_date, notes))
                conn.close()
                flash('Expense record added successfully!', 'success')
                return redirect(url_for('finances', tab='expense'))
            except Exception as e:
                error = f'Database error: {str(e)}'

    active_goals = []
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT id, goal_name, category FROM goals WHERE user_id=%s AND status='Active' ORDER BY goal_name ASC", (session.get('user_id'),))
            active_goals = cur.fetchall()
        conn.close()
    except Exception:
        pass

    return render_template('finances.html', tab='expense', error=error, user_name=session.get('user_name', 'User'), active_goals=active_goals)

@app.route('/add-budget', methods=['GET', 'POST'])
@login_required
# Form page: adds budget
def add_budget():
    if request.method == 'GET':
        return redirect(url_for('finances', tab='budget'))

    error = None
    if request.method == 'POST':
        category = request.form.get('category', '').strip()
        amount_str = request.form.get('limit_amount', '').strip()
        month_str = request.form.get('month', '').strip()
        year_str = request.form.get('year', '').strip()

        if not category or not amount_str or not month_str or not year_str:
            error = 'Category, Limit Amount, Month, and Year are all required.'
        else:
            try:
                limit_amount = float(amount_str)
                month = int(month_str)
                year = int(year_str)

                if limit_amount <= 0:
                    error = 'Limit amount must be greater than zero.'
                elif not 1 <= month <= 12:
                    error = 'Month must be a number between 1 and 12.'
            except ValueError:
                error = 'Please enter valid numeric values for amount, month, and year.'

        if not error:
            try:
                goal_id = request.form.get('goal_id') or None
                if goal_id:
                    goal_id = int(goal_id)
                conn = get_db_connection()
                with conn.cursor() as cur:
                    cur.execute('INSERT INTO budget (user_id, category, limit_amount, month, year, goal_id) VALUES (%s, %s, %s, %s, %s, %s)', (session.get('user_id'), category, limit_amount, month, year, goal_id))
                conn.close()
                flash('Budget record created successfully!', 'success')
                return redirect(url_for('finances', tab='budget'))
            except Exception as e:
                error = f'Could not create budget (it may already exist for this category/month): {str(e)}'

    # Fetch active goals for the link dropdown
    active_goals = []
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT id, goal_name, category FROM goals WHERE user_id=%s AND status='Active' ORDER BY goal_name ASC", (session.get('user_id'),))
            active_goals = cur.fetchall()
        conn.close()
    except Exception:
        pass

    return render_template('finances.html', tab='budget', error=error, user_name=session.get('user_name', 'User'), active_goals=active_goals)

@app.route('/add-investment', methods=['GET', 'POST'])

@login_required

# Form page: adds investment

def add_investment():
    error = None
    user_id = session.get('user_id')
    user_name = session.get('user_name', 'User')

    if request.method == 'POST':
        source = request.form.get('source', '').strip()
        amount_str = request.form.get('amount', '').strip()
        invest_date = request.form.get('invest_date', '').strip()
        invest_type = request.form.get('invest_type', 'General').strip()
        notes = request.form.get('notes', '').strip()

        if not source or not amount_str or not invest_date:
            error = 'Source, Amount, and Date are required fields.'
        else:
            try:
                amount = float(amount_str)
                if amount <= 0:
                    error = 'Amount must be a positive number greater than zero.'
            except ValueError:
                error = 'Please enter a valid numeric amount.'

        if not error:
            try:
                conn = get_db_connection()
                with conn.cursor() as cur:
                    cur.execute(
                        'INSERT INTO investments (user_id, source, amount, invest_date, invest_type, notes) VALUES (%s, %s, %s, %s, %s, %s)',
                        (user_id, source, amount, invest_date, invest_type, notes)
                    )
                conn.close()
                flash('Investment record added successfully! 📈', 'success')
                return redirect(url_for('add_investment'))
            except Exception as e:
                error = f'Database error: {str(e)}'

    # Fetch investments
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute('SELECT id, source, amount, invest_date, invest_type, notes FROM investments WHERE user_id = %s ORDER BY invest_date DESC', (user_id,))
            rows = cur.fetchall()
        conn.close()

        investments = []
        total_invested = 0.0
        total_current = 0.0
        for r in rows:
            amount = float(r['amount'])
            curr_val = amount * 1.12  # Simulate a 12% return for consistency with user screenshot
            total_invested += amount
            total_current += curr_val
            investments.append({
                'id': r['id'],
                'source': r['source'],
                'amount': amount,
                'current_value': curr_val,
                'est_return': '+12%',
                'invest_date': str(r['invest_date']),
                'invest_type': r['invest_type'],
                'notes': r['notes']
            })
        
        total_pl = total_current - total_invested
        avg_return = 12.0 if investments else 0.0
        inv_summary = {
            'total_invested': total_invested,
            'current_value': total_current,
            'total_pl': total_pl,
            'avg_return': avg_return
        }
    except Exception as e:
        print("Error fetching investments:", e)
        investments = []
        inv_summary = {
            'total_invested': 0.0,
            'current_value': 0.0,
            'total_pl': 0.0,
            'avg_return': 0.0
        }

    return render_template('investment.html', error=error, user_name=user_name, investments=investments, inv_summary=inv_summary)

@app.route('/api/investment/<int:invest_id>/delete', methods=['POST'])
@login_required
def delete_investment(invest_id):
    user_id = session.get('user_id')
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM investments WHERE id = %s AND user_id = %s", (invest_id, user_id))
            inv = cur.fetchone()
            if not inv:
                flash("Investment record not found or access denied.", "danger")
            else:
                cur.execute("DELETE FROM investments WHERE id = %s", (invest_id,))
                flash("Investment record deleted successfully! 🗑️", "success")
        conn.close()
    except Exception as e:
        flash(f"Error deleting investment: {str(e)}", "danger")
    return redirect(url_for('add_investment'))

@app.route('/api/balance-summary')

@login_required

# API: gets total balance

def api_balance_summary():

    user_id = session.get('user_id')

    try:

        conn = get_db_connection()

        with conn.cursor() as cur:

            cur.execute('SELECT COALESCE(SUM(amount), 0) AS total FROM income WHERE user_id = %s', (user_id,))

            total_income = float(cur.fetchone()['total'])

            cur.execute('SELECT COALESCE(SUM(amount), 0) AS total FROM expenses WHERE user_id = %s', (user_id,))

            total_expenses = float(cur.fetchone()['total'])

        conn.close()

        balance = total_income - total_expenses

        return (jsonify({'total_income': total_income, 'total_expenses': total_expenses, 'balance': balance}), 200)

    except Exception as e:

        return (jsonify({'error': str(e)}), 500)

@app.route('/api/reset-data', methods=['POST'])

@login_required

# API: resets all data to 0

def api_reset_data():

    user_id = session.get('user_id')

    try:

        conn = get_db_connection()

        with conn.cursor() as cur:

            cur.execute('DELETE FROM income WHERE user_id = %s', (user_id,))

            cur.execute('DELETE FROM expenses WHERE user_id = %s', (user_id,))

            cur.execute('DELETE FROM budget WHERE user_id = %s', (user_id,))

            cur.execute('DELETE FROM investments WHERE user_id = %s', (user_id,))

        conn.close()

        return jsonify({'status': 'success', 'message': 'All your data has been reset to 0.'})

    except Exception as e:

        return jsonify({'error': str(e)}), 500