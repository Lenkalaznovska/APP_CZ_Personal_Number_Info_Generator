document.getElementById("rcForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const rc = document.getElementById("rcInput").value;
  const resultDiv = document.getElementById("result");

  try {
    const { birthDate, gender, age } = getBirthDateFromRC(rc);
    resultDiv.innerHTML = `
          <p><strong>Datum narození:</strong> ${birthDate}</p>
          <p><strong>Pohlaví:</strong> ${gender}</p>
          <p><strong>Věk:</strong> ${age} let</p>
      `;
  } catch (error) {
    resultDiv.innerHTML = `<p style="color: red;"><strong>Chyba:</strong> ${error.message}</p>`;
  }
});

function getBirthDateFromRC(rc) {
  if (rc.length !== 11 || rc[6] !== "/") {
    throw new Error("Rodné číslo musí mít formát YYMMDD/XXXX");
  }

  const year = parseInt(rc.substring(0, 2), 10);
  let month = parseInt(rc.substring(2, 4), 10);
  const day = parseInt(rc.substring(4, 6), 10);

  let fullYear;
  if (year >= 54) {
    fullYear = 1900 + year;
  } else {
    fullYear = 2000 + year;
  }

  let gender;
  if (month > 50) {
    month -= 50;
    gender = "Žena";
  } else {
    gender = "Muž";
  }

  const date = new Date(fullYear, month - 1, day);
  if (
    date.getDate() !== day ||
    date.getMonth() + 1 !== month ||
    date.getFullYear() !== fullYear
  ) {
    throw new Error("Neplatné datum v rodném čísle");
  }

  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  const birthDate = date.toLocaleDateString("cs-CZ", options);

  const today = new Date();
  let age = today.getFullYear() - fullYear;
  if (
    today.getMonth() + 1 < month ||
    (today.getMonth() + 1 === month && today.getDate() < day)
  ) {
    age--;
  }

  return { birthDate, gender, age };
}
