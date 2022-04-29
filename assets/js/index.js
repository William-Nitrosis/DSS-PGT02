$("#add_post").submit(function (event) {
    alert("Data Inserted Successfully!");
})

$("#update_post").submit(function (event) {
    event.preventDefault();

    var unindexed_array = $(this).serializeArray();
    var data = {}

    $.map(unindexed_array, function (n, i) {
        data[n['name']] = n['value']
    })

    var request = {
        "url": `http://localhost:3000/posts/api/posts/${data.id}`,
        "method": "PUT",
        "data": data
    }

    $.ajax(request).done(function (response) {
        alert("Data Updated Successfully!");
    })

})

function deletefunction(ids){   

    var request = {
        "url" : `http://localhost:3000/posts/api/posts/${ids}`,
        "method" : "DELETE"
    }
    if(confirm("Do you really want to delete this record?")){
        $.ajax(request).done(function(response){
            alert("Data Deleted Successfully!");
            location.reload();
        })
    }
} 

