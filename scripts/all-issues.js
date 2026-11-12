const allBtn = document.getElementById("all_btn");
const allIssuesContainer = document.getElementById("all-issues");
// open button
const openBtn = document.getElementById("open_btn");
// closed button
const closed_btn = document.getElementById("closed_btn");
let currentFilter = "all";
let allIssues = [];
const issues_count = document.getElementById("issues_count");

// counter
const issue_count = (num) => {
    const counter = issues_count.innerText = num;
    return counter;
}



const showAllIssues = () => {
    currentFilter = "all";

    const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

    // allBtn.classList.add("active");
    allBtn.classList.add("active");


    fetch(url)
        .then((response) => response.json())
        .then((issues) => {
            // console.log("API total:", issues.data.length);
             allIssues = issues.data;
            //  console.log("allIssues total:", allIssues.length);
             viewAllIssue(allIssues);
            //  console.log(allIssues.length);
             
            //  console.log("Counter after update:", issues_count.innerText);
        })
}
showAllIssues();

const viewAllIssue = (issues) => {
    allIssuesContainer.innerHTML = "";

    issues.forEach(issue => {
        // console.log(issue);
        const newIssuesDiv = document.createElement("div")
        newIssuesDiv.innerHTML = `
            <!-- issues area start -->
            <div class="single_issue bg-white space-y-4 p-4 border-t-[3px] border-[#00A96E] rounded-t-lg" ">
                <div class="flex justify-between items-center">
                    <img src="${issue.status === "open" ? "assets/Open-Status.png" : "assets/Closed- Status .png"}" alt="icon">
                    <button class="${issue.priority === "high"
                        ? "bg-red-200 text-[#EF4444]"
                            : issue.priority === "medium"
                            ? "bg-[#b39c75] text-[#FFF6D1]"
                            : "bg-[#EEEFF2] text-[#9CA3AF]"
                    } rounded-full py-[1px] px-6 font-medium uppercase">${issue.priority}</button>
                </div>
                <h3 class="font-semibold text-[16px] text-[#1F2937]">${issue.title}</h3>
                <p class="text-[#64748B] text-xs">${issue.description}</p>
                <div class="flex items-center justify-start gap-2">
                    ${labelsArray(issue.labels)}
                </div>
                <div class="space-y-2">
                    <p class="text-[#64748B] text-[12px] font-medium">#1 by ${issue.assignee}</p>
                    <p class="text-[#64748B] text-[12px] font-medium">${issue.createdAt}</p>
                    <p class="text-[#64748B] text-[10px] font-thin">${issue.status}</p>
                    <button class="btn check-issue py-[1px] px-1 text-[12px]" data-id="${issue.id}">Check Issue</button>
                </div>
            </div>
            <!-- issues area start ends -->
        `;
        allIssuesContainer.appendChild(newIssuesDiv);
        issue_count(issues.length);
    });
}






// for labels
const labelsArray = (arr) => {
    const htmlElement = arr.map((singleArray) => 
        `<button class="bg-red-200 text-[#EF4444] rounded-full py-[1px] px-2 font-medium text-[10px] uppercase border border-red-300">${singleArray}</button>`
    )
    return htmlElement.join(" ") 
}


// show open button
const showOpenIssues = () => {
    currentFilter = "open";

    openBtn.classList.add("active");
    allBtn.classList.remove("active");
    closed_btn.classList.remove("active");

    const openIssues = allIssues.filter((issue) => {
         return issue.status === "open";
    })

    viewAllIssue(openIssues);
    // console.log(openIssues.length);
    issue_count(openIssues.length)
    allBtn.classList.remove("active");
}

// show closed issues
const showClosedIssues = () => {
    currentFilter = "closed";

    closed_btn.classList.add("active")
    openBtn.classList.remove("active")
    

    const closedIssues = allIssues.filter((closeIssue) => {
        return closeIssue.status === "closed";
    })

    viewAllIssue(closedIssues);
    issue_count(closedIssues.length)
    allBtn.classList.remove("active");
    
}


allBtn.addEventListener("click", () => {
    allBtn.classList.add("active");
    openBtn.classList.remove("active");
    closed_btn.classList.remove("active");

    viewAllIssue(allIssues);
})
openBtn.addEventListener("click", showOpenIssues);
closed_btn.addEventListener("click", showClosedIssues);





// show issue details in modal
const loadIssueDetails = async(id) => {
    try {
        const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch issues!!")
        }
        const newSingleIssue = await response.json();
        displayIssueDetails(newSingleIssue.data);
        
        
    }
    catch(error) {
        console.log("Error:", error.message);
    }
    finally {
        console.log("Issues - Fetch Request Completed"); 
    }
}


const displayIssueDetails = (issue) => {
    // console.log(issue);
    const detailsModel = document.getElementById("detailsModel");
    detailsModel.innerHTML = `
        <span class="bg-green-600 text-white rounded-full py-[1px] px-6 font-medium uppercase">${issue.priority}</span>
        <h2 class="font-bold text-[22px]"> ${issue.title}</h2>
        <p>${issue.description}</p>
        <p>Status: ${issue.status}</p>
        <p>Author: ${issue.assignee}</p>
        <p>${labelsArray(issue.labels)}</p>
    `;
    document.getElementById("my_modal").showModal();
}


allIssuesContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("check-issue")) {
        const issueId = event.target.dataset.id;
        // console.log(issueId);
        loadIssueDetails(issueId);
    }
});


// searchbar
const searchInput = document.getElementById("search_input");
const btn_search = document.getElementById("btn_search");

// btn_search.addEventListener("click", () => {
//     const searchVa = search_input.value.trim().toLowerCase();
//     // console.log(searchVa);
//     fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q={`${word}`}")
// })

const searchIssues = async(searchText) => {
    const url = `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${encodeURIComponent(searchText)}`

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch search result!!")    
        }
        const data = await response.json();
        viewAllIssue(data.data);
        

    }
    catch (error) {
        console.log("Search Error:", error.message);
    }
    finally {
        console.log("Search Fetch Request Completed"); 
    }
}

// Search input event
searchInput.addEventListener("input", (event) => {
    const searchText = event.target.value.trim();

    // console.log(searchText);
    if (searchText === "") {

        if (currentFilter === "all") {
            viewAllIssue(allIssues);
        } else if (currentFilter === "open") {
            showOpenIssues();
        } else if (currentFilter === "closed") {
            showClosedIssues();
        }
        
        // allBtn.classList.add("active");
        // openBtn.classList.remove("active");
        // closed_btn.classList.remove("active");
        return;
    }

    searchIssues(searchText);
    
})