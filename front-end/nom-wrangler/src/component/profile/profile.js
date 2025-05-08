import React from 'react';

const Profile = () => {
    const dummyUser = {
        name: "John Doe",
        email: "johndoe@example.com",
        bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        avatar: "https://via.placeholder.com/150",
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <img
                    src={dummyUser.avatar}
                    alt="User Avatar"
                    style={{ borderRadius: "50%", width: "150px", height: "150px" }}
                />
            </div>
            <h1 style={{ textAlign: "center" }}>{dummyUser.name}</h1>
            <p style={{ textAlign: "center", color: "gray" }}>{dummyUser.email}</p>
            <div style={{ marginTop: "20px", textAlign: "center" }}>
                <p>{dummyUser.bio}</p>
            </div>
        </div>
    );
};

export default Profile;