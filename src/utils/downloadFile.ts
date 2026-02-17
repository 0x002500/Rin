export function downloadDataUri(dataUri: string, filename: string) {
  const link = document.createElement('a')
  link.setAttribute('href', dataUri)
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  try {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } finally {
    URL.revokeObjectURL(url)
  }
}
