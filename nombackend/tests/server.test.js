test("server is running", () => {
    fetch("http://localhost:3000")
        .then((response) => {
            expect(response.status).toBe(200);
        })
        .catch((error) => {
            console.error("Error fetching server:", error);
        });
})