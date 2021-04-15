console.log('Client side javascript is running')

const myForm = document.querySelector('form')
const urlField = document.querySelector('input')

const message = document.getElementById('short-url')
const copyButton = document.getElementById('copy-button')


const postData = async (url, data) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return response.json()
}

myForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const data = encodeURI(urlField.value)

    message.innerHTML = 'Loading...'    

    postData('', { data })
        .then(data => {
            if(data.error) {
                message.innerHTML = data.error
            }
            else {
                document.getElementById('declare').innerHTML = 'Your url:'
                message.innerHTML =  data.shortenedURL
                copyButton.style.visibility = "visible";
            }
        })   
})

function copyToClipboard(element) {
    // Copy
    var $temp = $("<input>")
    $("body").append($temp)
    $temp.val($(element).text()).select()
    document.execCommand("copy")
    $temp.remove()    
    alert("Your short URL has been copied to clipboard!")
}
  