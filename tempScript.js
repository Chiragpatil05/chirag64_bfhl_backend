
const postRequest = async () =>{
    const requestData = {
        data : ['A','f',23,4,56,134,'c'],
    }
    
    const response = await fetch("http://localhost:5555/shree",{
        method : "POST",
        headers : {
            "Content-Type" : "application/json",
        },
        body : JSON.stringify(requestData)
    })

    const data = await response.json();
    console.log(data);
}

postRequest();