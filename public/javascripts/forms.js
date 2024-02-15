// VALIDATE ENDPOINT FORM BEFORE VALIDATE
document.getElementById("endpoint-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const responseType = document.getElementById("type").value;
    const response = document.getElementById("response").value;

    if (responseType === 'json') {
        try {
            JSON.parse(response);
        } catch (_) {
            console.log("Bad response: invalid json");
            alert("Bad response: invalid json");
            return;
        }
    }
    event.target.submit();
});