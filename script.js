// Add an event listener to the form submission
document.getElementById("rcForm").addEventListener("submit", function (event) {
  // Prevent the default form submission
  event.preventDefault();

  // Get the value of the input field
  const rc = document.getElementById("rcInput").value;
  // Get the result div element
  const resultDiv = document.getElementById("result");

  try {
    // Get the birth date information from the RC number
    const { birthDate, gender, age, daysUntilBirthday } = getBirthDateFromRC(rc);
    // Display the result in the result div
    resultDiv.innerHTML = `
          <p><strong>Datum narození:</strong> ${birthDate}</p>
          <p><strong>Pohlaví:</strong> ${gender}</p>
          <p><strong>Věk:</strong> ${age} let</p>
          <p><strong>Do příštích narozenin zbývá:</strong> ${daysUntilBirthday} dní</p>
      `;
  } catch (error) {
    // Display error message if there is an exception
    resultDiv.innerHTML = `<p style="color: red;"><strong>Chyba:</strong> ${error.message}</p>`;
  }
});

// Function to get birth date and related information from RC number
function getBirthDateFromRC(rc) {
  // Check if the RC number format is valid
  if (rc.length !== 11 || rc[6] !== "/") {
    throw new Error("Rodné číslo musí mít formát YYMMDD/XXXX");
  }

  // Extract year, month, and day from the RC number
  const year = parseInt(rc.substring(0, 2), 10);
  let month = parseInt(rc.substring(2, 4), 10);
  const day = parseInt(rc.substring(4, 6), 10);

  let fullYear;
  // Determine the full year based on the extracted year
  if (year >= 54) {
    fullYear = 1900 + year;
  } else {
    fullYear = 2000 + year;
  }

  let gender;
  // Determine gender based on the month value
  if (month > 50) {
    month -= 50;
    gender = "Žena";
  } else {
    gender = "Muž";
  }

  // Create a date object and validate the date
  const date = new Date(fullYear, month - 1, day);
  if (
    date.getDate() !== day ||
    date.getMonth() + 1 !== month ||
    date.getFullYear() !== fullYear
  ) {
    throw new Error("Neplatné datum v rodném čísle");
  }

  // Format the birth date for display
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  const birthDate = date.toLocaleDateString("cs-CZ", options);

  // Calculate age
  const today = new Date();
  let age = today.getFullYear() - fullYear;
  if (
    today.getMonth() + 1 < month ||
    (today.getMonth() + 1 === month && today.getDate() < day)
  ) {
    age--;
  }

  // Calculate days until next birthday
  const nextBirthday = new Date(today.getFullYear(), month - 1, day);
  if (today > nextBirthday) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }

  const timeDiff = nextBirthday - today;
  const daysUntilBirthday = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;

  // Return the birth date, gender, age, and days until next birthday
  return { birthDate, gender, age, daysUntilBirthday };
}
