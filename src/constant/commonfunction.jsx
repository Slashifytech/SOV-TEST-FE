export function formatDate(timestamp) {
  const date = new Date(timestamp);

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();

  return `${day}-${month}-${year}`;
}

  export const extractFileName = (url) => {
    const fileName = url.replace(/^.*\/o\//, ''); // Removes everything up to and including '/o/'
  const fileNameTrimmed = fileName.split('?')[0]; // Removes any query parameters after the file name
  const decodedFileName = decodeURIComponent(fileNameTrimmed); 
  return decodedFileName;
  };

  export function extractFileNames(filePath) {
    // Get the last part of the path (filename)
    const fullName = filePath.split('/').pop();

    // Split by '-' to get the last part
    const parts = fullName.split('-');

    // Get the last part (before the extension)
    const lastPart = parts.pop(); // Remove the last part
    const nameWithExtension = lastPart.split('.'); // Split by '.'

    // Format the name correctly
    const formattedName = nameWithExtension[0]
        .split(' ')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join('.');

    // Get the file extension
    const extension = nameWithExtension.pop(); // Get the extension

    return `${formattedName}.${extension}`; // Combine formatted name with the extension
}

export function getMonthName(dateString) {

  const [,  month,] = dateString.split("-");

  return month
}

export function getYear(dateString) {
  // Split the input string into components
  const [year] = dateString.split("-");

  // Return the year
  return year;
}

export function sortByFirstLetter(data, fieldName) {
  if (!Array.isArray(data)) {
    throw new Error('Input data must be an array');
  }

  // Create a shallow copy to avoid modifying the original array
  const copyData = [...data];

  return copyData.sort((a, b) => {
    const firstLetterA = a[fieldName]?.charAt(0).toLowerCase() || '';
    const firstLetterB = b[fieldName]?.charAt(0).toLowerCase() || '';

    if (firstLetterA < firstLetterB) return -1;
    if (firstLetterA > firstLetterB) return 1;
    return 0;
  });

}


export const removeDuplicates = (options) => {
  const seen = new Set();
  return options.filter((option) => {
    const isDuplicate = seen.has(option.courseName);
    seen.add(option.courseName);
    return !isDuplicate;
  });
};