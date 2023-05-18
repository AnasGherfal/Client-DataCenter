export function isLibyanPhoneNumber(input: string): boolean {
  const phoneRegex = /^(?:\+?218)(?:(?:91|92|94|95)\d{7})$/;
  return phoneRegex.test(input);
}

export function validateText(text: string) {
  // Regular expression pattern to match English and Arabic letters
  const pattern = /^[\u0600-\u06FF\sA-Za-z]+$/;

  // Test the input text against the pattern
  const isValid = pattern.test(text);

  return isValid;
}
