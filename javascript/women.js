document.addEventListener('DOMContentLoaded', function () {
    const main = document.getElementById("main");
    const search = document.getElementById("search");
  const category_filter=document.getElementById("category-filter")
    const url = "https://gifted-tights-yak.cyclic.app/products/show?category=women&page=1";
    const Cart_url = "https://gifted-tights-yak.cyclic.app/cart/add";
  const sorting=document.getElementById("price-sort")
    FetchData(url);
  
    function FetchData(url) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not OK');
                }
                return response.json();
            })
            .then(data => {
                MappingtheResponse(data);
            })
            .catch(error => {
                console.error(error);
            });
    }
    const nextButton = document.getElementById("next-button");
    const prevButton = document.getElementById("prev-button");
    let page=1
    prevButton.disabled=true
    nextButton.addEventListener("click", function(e){
      page++
      console.log(page);
    prevButton.disabled=false
      fetch(`https://gifted-tights-yak.cyclic.app/products/show/?category=men&page=${page}`)
     
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not OK');
                }
                return response.json();
            })
            .then(async data => {
             
              main.innerHTML=""
              MappingtheResponse(data);
              let newpage=page
              const nextres=await fetch(`https://gifted-tights-yak.cyclic.app/products/show/?category=women&page=${newpage++}`)
              const nextress=await nextres.json()
              if(!nextress.data){
                nextButton.disabled=true
              }
               // MappingtheResponse(data);
            })
            .catch(error => {
                console.error(error);
            });
    })
    prevButton.addEventListener("click",function(e){
     // e.preventDefault()
      page=page-1
      console.log(page);
      nextButton.disabled=false
       
        fetch(`https://gifted-tights-yak.cyclic.app/products/show/?category=women&page=${page}`)
              .then(response => {
                  if (!response.ok) {
                      throw new Error('Network response was not OK');
                  }
                  return response.json();
              })
              .then(data => {
               
                main.innerHTML=""
                  MappingtheResponse(data);
                  if(page<=1){
                    prevButton.disabled=true
                  }
              })
              .catch(error => {
                  console.error(error);
              });
      
  
     
    })
    function MappingtheResponse(data) {
        data.forEach(e => {
            const cards = DynamicCards(e._id,e.img, e.title, e.brand, e.price);
            main.insertAdjacentHTML('beforeend', cards);
        });
    }
  
    function DynamicCards(id,img, title, brand, price) {
        return `<div id="card" data-id="${id}">
            <img class="card_img" src="${img}">
            <p class="card_title">${title}</p>
            <h5 class="card_brand">${brand}</h5>
            <p class="card_price">${price}</p>
            <button class="cart-button">Add to cart</button>
        </div>`;
    }
  
    const cart_button = document.querySelector(".cart-button");
  
    function AddtoCart(img, title, brand, price, Cart_url) {
        let data = {
            img,
            title,
            brand,
            price,
        };
  if(!JSON.parse(localStorage.getItem("token"))){
    alert("please login first")
    return  window.location.href="../login-form-06/index.html"
  }
        fetch(Cart_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "token": JSON.parse(localStorage.getItem("token")),
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                console.log(response);
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Request failed with status ' + response.status);
                }
            })
            .then(data => {
                console.log(data);
                alert(data.msg);
            })
            .catch(error => {
                console.error(error);
            });
    }
  
    main.addEventListener("click", function (event) {
        if (event.target.classList.contains("cart-button")) {
            const card = event.target.closest("#card");
            const card_img = card.querySelector(".card_img").src;
            const card_title = card.querySelector(".card_title").textContent;
            const card_brand = card.querySelector(".card_brand").textContent;
            const card_price = card.querySelector(".card_price").textContent;
            AddtoCart(card_img, card_title, card_brand, card_price, Cart_url);
        }
    });
  let debouncer;
    search.addEventListener("input", function (e) {
        const searchValue = e.target.value.trim().toLowerCase();
      const sort=sorting.value
        clearTimeout(debouncer)
        debouncer=setTimeout(() => {
          main.innerHTML=""
          filterCards(searchValue,category_filter.value,sort)
        }, 500);
    });
    sorting.addEventListener("change",(e)=>{
      e.preventDefault()
      const sort=sorting.value
      const searchValue = search.value.trim().toLowerCase();
      const filterByBrand=category_filter.value.trim().toLowerCase()
      debouncer=setTimeout(() => {
        main.innerHTML=""
        filterCards(searchValue,filterByBrand,sort)
      }, 500);
    })
    category_filter.addEventListener("change",(e)=>{
      e.preventDefault()
      const sort=sorting.value
      const searchValue = search.value.trim().toLowerCase();
      const filterByBrand=category_filter.value.trim().toLowerCase()
      debouncer=setTimeout(() => {
        main.innerHTML=""
        filterCards(searchValue,filterByBrand,sort)
      }, 500);
      //filterCards(searchValue,filterByBrand)
    })
  
    function filterCards(searchValue,filterByBrand,sort) {
        const queryParams = new URLSearchParams();
        if (searchValue !== "") {
            queryParams.append("title", searchValue);
        }
       if(filterByBrand!==""){
        queryParams.append("brand",filterByBrand)
       }
       if(sort){
        queryParams.append("sbp",sort)
       }
        const queryString = queryParams.toString();
       
        const filteredUrl = `https://gifted-tights-yak.cyclic.app/products/show?category=women&${queryString}`;
  
        FetchData(filteredUrl);
    }
  });
  main.addEventListener("click", function (event) {
    const card = event.target.closest("#card");
    if (card) {
      const cardId = card.getAttribute("data-id");
      localStorage.setItem("selectedProductId", cardId);
      window.location.href="exp.html"
    }
  });