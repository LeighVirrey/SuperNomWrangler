

test("server is running", () => {
    return fetch("http://localhost:4000").then((response) => {
        expect(response.status).toBe(200);
    });
})

test("register user POST all params Returns 201", () => {
    
    return fetch("http://localhost:4000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: "testuser",
            password: "testpass",
            email: "testuser@example.com"
        })
    }).then((response) => {
        expect(response.status).toBe(201);
    });
})

test("register user POST missing params Returns 400", () => {
    return fetch("http://localhost:4000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
    }).then((response) => {
        expect(response.status).toBe(400);
    });
})

test("register user POST same user params Returns 409", () => {
    return fetch("http://localhost:4000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: "testuser",
            password: "testpass",
            email: "testuser@example.com"
        })
    }).then((response) => {
        expect(response.status).toBe(409);
    });
})

test("login user POST all params Returns 200", () => {
    return fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: "testuser",
            password: "testpass",
            email: "testuser@example.com"
        })
    }).then((response) => {
        expect(response.status).toBe(200);
    });
})

test("login user POST missing params Returns 400", () => {
    return fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
    }).then((response) => {
        expect(response.status).toBe(400);
    });
})

test("login user POST wrong params Returns 401", () => {
    return fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: "wrongwrongwrong",
            password: "wrongwrongwrong",
            email: "wrong@wrong.wrong"
        })
    }).then((response) => {
        expect(response.status).toBe(401);
    });
})

test("login user POST wrong password Returns 401", () => {
    return fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: "testuser",
            password: "wrongwrongwrong",
            email: "wrong@wrong.wrong"
        })
    }).then((response) => {
        expect(response.status).toBe(401);
    });
})

test("api/restaurants GET Returns 200", () => {
    return fetch("http://localhost:4000/api/restaurants", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        body: {
            lat: 40.7606,
            lon: 111.8881,
        }
    }).then((response) => {
        expect(response.status).toBe(200);
    });
})

test("api/restaurants GET missing params Returns 400", () => {
    return fetch("http://localhost:4000/api/restaurants", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then((response) => {
        expect(response.status).toBe(400);
    });
})

test("restaurant/review POST Returns 201", () => {
    return fetch("http://localhost:4000/restaurant/review", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            restaurantName: "test",
            imageUrl: "https://lh3.googleusercontent.com/gps-cs-s/AB5caB_FEWKdmdQVET9381JO8q23Cy2FwZw_Mu6HKdzEXdYwecoyMx-N0O9_EERPG0mIYQqT43eCRCX0rq6Re5s84gbovjlt4fGWyHGWNRkbNtCIFUP-edyelizr2A3_H_VBv9aqRLfc=s1360-w1360-h1020",
            streetName: "Main St",
            streetNumber: "123",
            city: "Austin",
            state: "TX",
            zipCode: "78701",
            country: "USA",
            description: "test",
            cuisineTypes: ["test"],
            diningStyle: "Sit down",
            priceRange: "$$",
            otherNotes: "test",
            operatingHours: [{ day: "Monday", open: "10:00", close: "21:00" }],
            userReview: "test",
            isFlagged: false
        })
    }).then((response) => {
        expect(response.status).toBe(201);
    });
})

test("restaurant/review POST missing params Returns 400", () => {
    return fetch("http://localhost:4000/restaurant/review", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
    }).then((response) => {
        expect(response.status).toBe(400);
    });
})

test("restaurant/review POST same params Returns 400", () => {
    return fetch("http://localhost:4000/restaurant/review", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            restaurantName: "test",
            imageUrl: "https://lh3.googleusercontent.com/gps-cs-s/AB5caB_FEWKdmdQVET9381JO8q23Cy2FwZw_Mu6HKdzEXdYwecoyMx-N0O9_EERPG0mIYQqT43eCRCX0rq6Re5s84gbovjlt4fGWyHGWNRkbNtCIFUP-edyelizr2A3_H_VBv9aqRLfc=s1360-w1360-h1020",
            streetName: "Main St",
            streetNumber: "123",
            city: "Austin",
            state: "TX",
            zipCode: "78701",
            country: "USA",
            description: "test",
            cuisineTypes: ["test"],
            diningStyle: "Sit down",
            priceRange: "$$",
            otherNotes: "test",
            operatingHours: [{ day: "Monday", open: "10:00", close: "21:00" }],
            userReview: "test",
            isFlagged: false
        })
    }).then((response) => {
        expect(response.status).toBe(400);
    });
})

test("restaurant/review GET all Returns 200", () => {
    return fetch("http://localhost:4000/restaurant/review", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then((response) => {
        expect(response.status).toBe(200);
    });
})

test("restaurant/review/:id GET by id Returns 200", () => {
    return fetch("http://localhost:4000/restaurant/review/1", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then((response) => {
        expect(response.status).toBe(200);
    });
})

test("restaurant/review/:id GET by id no review Returns 404", () => {
    return fetch("http://localhost:4000/restaurant/review/999999999", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then((response) => {
        expect(response.status).toBe(404);
    });
})

test("restaurant/review/:id PUT returns 200", () => {
    return fetch("http://localhost:4000/restaurant/review/1", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            restaurantName: "test",
            imageUrl: "https://lh3.googleusercontent.com/gps-cs-s/AB5caB_FEWKdmdQVET9381JO8q23Cy2FwZw_Mu6HKdzEXdYwecoyMx-N0O9_EERPG0mIYQqT43eCRCX0rq6Re5s84gbovjlt4fGWyHGWNRkbNtCIFUP-edyelizr2A3_H_VBv9aqRLfc=s1360-w1360-h1020",
            streetName: "Main St",
            streetNumber: "123",
            city: "Austin",
            state: "TX",
            zipCode: "78701",
            country: "USA",
            description: "test",
            cuisineTypes: ["test"],
            diningStyle: "Sit down",
            priceRange: "$$",
            otherNotes: "test",
            operatingHours: [{ day: "Monday", open: "10:00", close: "21:00" }],
            userReview: "test",
            isFlagged: false
        })
    }).then((response) => {
        expect(response.status).toBe(200);
    });
})

test("restaurant/review/:id PUT missing params Returns 404", () => {
    return fetch("http://localhost:4000/restaurant/review/999999999", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
    }).then((response) => {
        expect(response.status).toBe(404);
    });
})

test("restaurant/review/:id DELETE Returns 200", () => {
    return fetch("http://localhost:4000/restaurant/review/1", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    }).then((response) => {
        expect(response.status).toBe(200);
    });
})

test("restaurant/review/:id DELETE no review Returns 404", () => {
    return fetch("http://localhost:4000/restaurant/review/999999999", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    }).then((response) => {
        expect(response.status).toBe(404);
    });
})

test("restaurant/review/:id/flag PATCH Returns 200", () => {
    return fetch("http://localhost:4000/restaurant/review/1/flag", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
    }).then((response) => {
        expect(response.status).toBe(200);
    });
})

test("restaurant/review/:id/flag PATCH no review Returns 404", () => {
    return fetch("http://localhost:4000/restaurant/review/999999999/flag", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
    }).then((response) => {
        expect(response.status).toBe(404);
    });
})

test("restaurant/review/:id/unflag PATCH Returns 200", () => {
    return fetch("http://localhost:4000/restaurant/review/1/unflag", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
    }).then((response) => {
        expect(response.status).toBe(200);
    });
})

test("restaurant/review/:id/unflag PATCH no review Returns 404", () => {
    return fetch("http://localhost:4000/restaurant/review/999999999/unflag", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
    }).then((response) => {
        expect(response.status).toBe(404);
    });
})

test("api/restaurant GET googleApi Returns 200", () => {
    return fetch("http://localhost:4000/api/restaurant?zip=78701&radius=10", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then((response) => {
        expect(response.status).toBe(200);
    });
})

test("api/restaurant GET googleApi missing params Returns 404", () => {
    return fetch("http://localhost:4000/api/restaurant", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then((response) => {
        expect(response.status).toBe(404);
    });
})