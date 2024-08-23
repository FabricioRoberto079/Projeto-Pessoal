const route = (event) => {
    event = event || window.event
    event.preventDefoult()
    window.history.pushState({}, "", event.target.href)
}


const 


window.route = route;