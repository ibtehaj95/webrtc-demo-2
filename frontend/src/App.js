import React, { useEffect, useState } from "react";

function App (){

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