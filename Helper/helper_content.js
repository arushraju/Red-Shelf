//This will store the heading of the application
const helper_heading = {
    "0"     : {heading : "Main Menu - Red Shelf"},
    "1"     : {heading : "Explore (Floor Mode)"},
    "1.1"   : {heading : "Explore (GSAP Mode)"},
    "2"     : {heading : "Search Menu"},
    "2.1"   : {heading : "Shelf Search (Subject / Call Number)"},
    "2.2"   : {heading : "Quick Search Menu"},
    "2.8"   : {heading : "Shelf Selection (Click Destination GSAP)"},
    "2.3"   : {heading : "Choose Destination (Click Destination GSAP)"},
    "2.7"   : {heading : "Choose Destination (Click Destination GSAP)"},
    "2.4"   : {heading : "Choose Start (Click Start GSAP)"},
    "2.5"   : {heading : "Path Calculated (Click on any GSAP)"},
    "2.6"   : {heading : "Click the next GSAP"},
    "3"     : {heading : "Miscellaneous (Incomplete)"},
    "3.2"   : {heading : "Port Vacancy (Incomplete)"},
    "3.1"   : {heading : "Table Vacancy (Incomplete)"},
    "3.3"   : {heading : "Fan to Swtich Mapping (Incomplete)"},
    "4.1"   : {heading : "Admin Menu"},
    "4.2"   : {heading : "Frustum Settings"},
    "4.3"   : {heading : "Transform / Bookshelf Settings"},
}

//This is the URL of the images that are used in the helper content
const helper_images = {
    "0" : [

    ],
    "1" : [

    ]
}

//This is the helper content which will also contain the images
const helper_content = {
    "0" : {
        content : `
            <p>
                <span class="">Welcome to Red Shelf</span>. Think of this to be a virtual library. This application is an attempt to make it easier to navigate through the library. The main objective being, able to search a required bookshelf.
            </p>
        `
    },
    "1" : {
        content : `
            <p>
                This is the content of Explore Floor Mode. Explain about this mode, and all that could be done in this section.
            </p>
        `
    },
    "1.1" : {
        content : `
            <p>
                This is the content of application 1.1 which is about Explore but in the GSAP Mode.
            </p>
        `
    },
    "2" : {
        content : `
            <p>
                This is the content of application 2, which is about the Search Menu.
            </p>
        `
    },
    "2.1" : {
        content : `
            <p>
                This is the content of application 2.1 which is about Shelf Search whcih could be either Subject or Call Number.
            </p>
        `
    },
    "2.2" : {
        content : `
            <p>
                This is the content of application 2.2, and this is about the Quick Search menu.
            </p>
        `
    },
    "2.8" : {
        content : `
            <p>
                This is the content of application flow 2.8.
            </p>
        `
    },
    "2.3" : {
        content : `
            <p>
                This is the content of application flow 2.3.
            </p>
        `
    },
    "2.7" : {
        content : `
            <p>
                This is the content of application flow 2.7.
            </p>
        `
    },
    "2.4" : {
        content : `
            <p>
                This is the content of application flow 2.4.
            </p>
        `
    },
    "2.5" : {
        content : `
            <p>
                This is the content of application of 2.5.
            </p>
        `
    },
    "2.6" : {
        content : `
            <p>
                This is the content of application 2.6.
            </p>
        `
    },
    "3" : {
        content : `
            <p>
                This is the application flow 3. And this is the main menu for all the incomplete features about the app.
            </p>
        `
    },
    "3.1" : {
        content : `
            <p>
                This is to check the table vacancy. And this is application 3.1.
            </p>
        `
    },
    "3.2" : {
        content : `
            <p>
                This is to solve the problme of finding the vacant charging port. And this is the application number 3.2.
            </p>
        `
    },
    "3.3" : {
        content : `
            <p>
                So this mode could be used to find the right switch for a given fan. And this is the application 3.3.
            </p>
        `
    },
    "4.1" : {
        content : `
            <p>
                So here you will be able to do the following : <br>
                <ol>
                    <li>Change the location bookshelfs, Dustbins, Tables, GSAP's and many more things inside the library. <span style="font-weight : 700; color : red;"But it is important to note that you should not move any obejct from one floor to another. This will spoil the application</span></li>
                    <li>Change the name and the content inside the Frustum.</li>
                    <li>I also wanted to give the capability to change the graph of the GSAP whcih are the connections between the GSAP but for not this feature is incomplete.
                </ol>
            </p>
            <p>
                <h2>Transform</h2>
                Given below is what is meant by the GSAP, Frustum and bookshelfs. Here you can change the orientation, and position of the objects. And this change will be stored in the database, essentially making the change in the database.

                <br>

                <img src="" width="30%" alt="GSAP Image"/>
                <img src="" width="30%" alt="Frustum Image"/>
                <img src="" width="30%" alt="Bookshelf Image"/>

                <br>
            </p>
            <p>
                <h2>Frustum</h2>
            </p>
        `
    },
    "4.2" : {
        content : `
            <p>
                Here you will able to change the Frustum Setting. And this is application flow 4.2.
            </p>
        `
    },
    "4.3" : {
        content : `
            <p>
                This is the content of application 4.3. Which is about the Transform Settings.
            </p>
        `
    }
}

//This will be 
export const application_content = {
    "0" : {
        title : helper_heading["0"].heading,
        heading : helper_heading["0"].heading,
        content : helper_content["0"].content,
    },
    "1" : {
        title : helper_heading["1"].heading,
        heading : helper_heading["1"].heading,
        content : helper_content["1"].content,
    },
    "1.1" : {
        title : helper_heading["1.1"].heading,
        heading : helper_heading["1.1"].heading,
        content : helper_content["1.1"].content,
    },
    "2" : {
        title : helper_heading["2"].heading,
        heading : helper_heading["2"].heading,
        content : helper_content["2"].content,
    },
    "2.1" : {
        title : helper_heading["2.1"].heading,
        heading : helper_heading["2.1"].heading,
        content : helper_content["2.1"].content,
    },
    "2.2" : {
        title : helper_heading["2.2"].heading,
        heading : helper_heading["2.2"].heading,
        content : helper_content["2.2"].content,
    },
    "2.8" : {
        title : helper_heading["2.8"].heading,
        heading : helper_heading["2.8"].heading,
        content : helper_content["2.8"].content,
    },
    "2.3" : {
        title : helper_heading["2.3"].heading,
        heading : helper_heading["2.3"].heading,
        content : helper_content["2.3"].content,
    },
    "2.7" : {
        title : helper_heading["2.7"].heading,
        heading : helper_heading["2.7"].heading,
        content : helper_content["2.7"].content,
    },
    "2.4" : {
        title : helper_heading["2.4"].heading,
        heading : helper_heading["2.4"].heading,
        content : helper_content["2.4"].content,
    },
    "2.5" : {
        title : helper_heading["2.5"].heading,
        heading : helper_heading["2.5"].heading,
        content : helper_content["2.5"].content,
    },
    "2.6" : {
        title : helper_heading["2.6"].heading,
        heading : helper_heading["2.6"].heading,
        content : helper_content["2.6"].content,
    },
    "3" : {
        title : helper_heading["3"].heading,
        heading : helper_heading["3"].heading,
        content : helper_content["3"].content,
    },
    "3.2" : {
        title : helper_heading["3.2"].heading,
        heading : helper_heading["3.2"].heading,
        content : helper_content["3.2"].content,
    },
    "3.1" : {
        title : helper_heading["3.1"].heading,
        heading : helper_heading["3.1"].heading,
        content : helper_content["3.1"].content,
    },
    "3.3" : {
        title : helper_heading["3.3"].heading,
        heading : helper_heading["3.3"].heading,
        content : helper_content["3.3"].content,
    },
    "4.1" : {
        title : helper_heading["4.1"].heading,
        heading : helper_heading["4.1"].heading,
        content : helper_content["4.1"].content, 
    },
    "4.2" : {
        title : helper_heading["4.2"].heading,
        heading : helper_heading["4.2"].heading,
        content : helper_content["4.2"].content, 
    },
    "4.3" : {
        title : helper_heading["4.3"].heading,
        heading : helper_heading["4.3"].heading,
        content : helper_content["4.3"].content,
    }
};

//This function will clear the application
export function clear_application(){
    //Clear the Heading
    document.querySelector('.title-content').innerHTML = '';
    //Clear the helper content
    document.querySelector('.pop-up-heading-text').innerHTML = '';
    //Clear the Helper content
    document.querySelector('.pop-up-content-text').innerHTML = '';
}

//This function will update the html according to the current application flow
export function update_application(application_flow){
    document.querySelector('.title-content').innerHTML = application_content[`${application_flow}`].title;
    document.querySelector('.pop-up-heading-text').innerHTML = application_content[`${application_flow}`].heading;
    document.querySelector('.pop-up-content-text').innerHTML = application_content[`${application_flow}`].content;
}

