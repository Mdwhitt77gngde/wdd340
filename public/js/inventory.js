'use strict'

// wait for DOM
document.addEventListener("DOMContentLoaded", () => {
  const classificationList = document.querySelector("#classificationList")
  const inventoryDisplay  = document.getElementById("inventoryDisplay")

  classificationList.addEventListener("change", () => {
    const classification_id = classificationList.value
    const url = `/inv/getInventory/${classification_id}`

    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error("Network response was not OK")
        return response.json()
      })
      .then(data => {
        buildInventoryList(data)
      })
      .catch(error => {
        console.error("There was a problem:", error.message)
      })
  })

  function buildInventoryList(data) {
    let table = `<thead>
      <tr>
        <th>Vehicle Name</th>
        <th>Modify</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody>`

    data.forEach(item => {
      table += `<tr>
        <td>${item.inv_make} ${item.inv_model}</td>
        <td><a href="/inv/edit/${item.inv_id}" title="Click to update">Modify</a></td>
        <td><a href="/inv/delete/${item.inv_id}" title="Click to delete">Delete</a></td>
      </tr>`
    })

    table += "</tbody>"
    inventoryDisplay.innerHTML = table
  }
})
