Date.prototype.toQiwiFormat = function() {
    return this.getDate() + "/" + (this.getMonth() + 1) + "/" + this.getFullYear() + ", " + this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds().toString().padStart(2, "0")
}

let exchangeItems = []

const fetchExchages = async () => {
    try {
        const response = await fetch("https://www.cbr-xml-daily.ru/daily_json.js")
        return response.json()
    } catch (e) {
        return e.toString()
    }
}

const changeInfo = (selected) => {
    const infoContainerTitle = document.getElementById("info-container__title")
    const infoContainerCurrentExchange = document.getElementById("info-container__current-exchange")
    const infoContainerPrevExchange = document.getElementById("info-container__prev-exchange")

    fetchExchages().then((value) => {
        let currentDate = new Date(value["Date"]).toQiwiFormat()
        let prevDate = new Date(value["PreviousDate"]).toQiwiFormat()

        infoContainerTitle.innerHTML = value["Valute"][selected]["Name"]
        infoContainerCurrentExchange.innerHTML = currentDate + ", " + value["Valute"][selected]["Value"]
        infoContainerPrevExchange.innerHTML = prevDate + ", " + value["Valute"][selected]["Previous"]
    })
}

window.onload = function() {
    const content = document.getElementById("page__content");
    const optiongroup = document.getElementById("select__optiongroup");
    const select = document.getElementById("select");;

    select.addEventListener("change", e => {
        changeInfo(e.target.value)
    })

    fetchExchages().then((value) => {
        if (typeof value !== "string") {
            exchangeItems = Object.keys(value.Valute).map(it => {
                return {
                    id: value.Valute[it]["ID"],
                    sName: it,
                    fName: value.Valute[it]["Name"]
                }
            })
        } else {
            content.remove()
            let errorTitle = document.createElement("span");
            errorTitle.setAttribute('class', "error");
      
            let optionText = document.createTextNode("ОШИБКА: " + value);
            errorTitle.appendChild(optionText);
            
            page.appendChild(errorTitle);
        }
    }).then (() => {
        exchangeItems.map((item, index) => {
            let option = document.createElement("option");
            option.setAttribute('value', item.sName);
      
            let optionText = document.createTextNode(item.id + " - " + item.fName);
            option.appendChild(optionText);
            
            optiongroup.appendChild(option);
        })
    }).then(() => {
        if (exchangeItems.length !== 0) {
            changeInfo(exchangeItems[0].sName)
        }
    })
}