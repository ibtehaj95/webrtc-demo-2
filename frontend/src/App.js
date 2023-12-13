import React, { useEffect, useState } from "react";

function App (){

    const [apiURL] = useState("http://127.0.0.1:3000/api/v1");  //backend api url

    const hitServer = async () => {
        const resp = await fetch(`${apiURL}/auth/login`, {
            method: "POST",
            // mode: "cors", // no-cors, *cors, same-origin
            // credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },
            body: JSON.stringify({
                "email": "alex@email.com",
                "password": "secret",
            }),
        });
        const respresp = await resp.json();
        console.log(respresp);
    }

    useEffect(() => {
        console.log("UseEffect");
        // hitServer();
    }, []);

    return(
        <div className="App">
            The is a Webpack React App
        </div>
    );
}

export default App;