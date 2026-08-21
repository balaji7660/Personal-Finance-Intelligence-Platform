/**
 * Export data array to CSV file download
 */
export const exportToCSV = (data, filename = 'report.csv') => {
  if (!data || !data.length) {
    alert('No data available to export.')
    return
  }

  const headers = Object.keys(data[0])
  const csvRows = []

  // Add header row
  csvRows.push(headers.map(header => `"${header}"`).join(','))

  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header] === null || row[header] === undefined ? '' : row[header]
      const escaped = ('' + val).replace(/"/g, '""')
      return `"${escaped}"`
    })
    csvRows.push(values.join(','))
  }

  const csvString = csvRows.join('\n')
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Trigger print dialog for downloadable/printable PDF view
 */
export const printReport = () => {
  window.print()
}
