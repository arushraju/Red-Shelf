//This will store the heading of the application
const helper_heading = {
    "0"     : {heading : "Main Menu - Red Shelf"},
    "1"     : {heading : "Explore (Floor Mode) - Red Shelf"},
    "1.1"   : {heading : "Explore (GSAP Mode) - Red Shelf"},
    "2"     : {heading : "Search Menu - Red Shelf"},
    "2.1"   : {heading : "Shelf Search (Subject / Call Number) - Red Shelf"},
    "2.2"   : {heading : "Quick Search Menu - Red Shelf"},
    "2.8"   : {heading : "Shelf Selection (Click Destination GSAP) - Red Shelf"},
    "2.3"   : {heading : "Choose Destination (Click Destination GSAP) - Red Shelf"},
    "2.7"   : {heading : "Choose Destination (Click Destination GSAP) - Red Shelf"},
    "2.4"   : {heading : "Choose Start (Click Start GSAP) - Red Shelf"},
    "2.5"   : {heading : "Path Calculated (Click on any GSAP) - Red Shelf"},
    "2.6"   : {heading : "Click the next GSAP - Red Shelf"},
    "3"     : {heading : "Miscellaneous (Incomplete) - Red Shelf"},
    "3.2"   : {heading : "Port Vacancy (Incomplete) - Red Shelf"},
    "3.1"   : {heading : "Table Vacancy (Incomplete) - Red Shelf"},
    "3.3"   : {heading : "Fan to Swtich Mapping (Incomplete) - Red Shelf"},
    "4.1"   : {heading : "Admin Menu - Red Shelf"},
    "4.2"   : {heading : "Frustum Settings - Red Shelf"},
    "4.3"   : {heading : "Transform / Bookshelf Settings - Red Shelf"},
}

//This is the helper content which will also contain the images
const helper_content = {
    "0": {
    content: `
        <div class="helper-flex">
            <div>
                <p>
                    To access the different features of the website, expand the menu and choose an option based on your requirement.
                    A brief explanation of each feature is provided below.
                </p>
            </div>
            <div><img class="helper-gif" src="./Helper/Expand_Menu_Option.gif"/></div>
        </div>

        <hr>

        <div class="helper-flex">
            <div>
                Here are the functionalities available on the site:
                <br>
                <ul>
                    <li>
                        <b>Explore</b> :
                        <p style="font-weight:550;">
                            Explore the library both from the outside and inside in an interactive manner.
                        </p>
                    </li>

                    <li>
                        <b>Search</b> :
                        <p style="font-weight:550;">
                            Search for books, rooms, machines, facilities, and more throughout the library.
                        </p>
                    </li>

                    <li>
                        <b>Others</b> :
                        <p style="font-weight:550;">
                            Experimental features.
                        </p>
                    </li>

                    <li>
                        <b>Admin</b> :
                        <p style="font-weight:550;">
                            Used to modify the mesh and website settings. Accessible only to authenticated users.
                        </p>
                    </li>
                </ul>
            </div>

            <div><img class="helper-gif" src="./Helper/Main_menu_Options_Image.png"/></div>
        </div>

        <hr>

        <div class="helper-flex">
            <div>
                <p>
                    At any point, click the question mark icon to learn how to use the website.
                </p>
            </div>

            <div><img class="helper-gif" src="./Helper/Help_Button.gif"/></div>
        </div>
    `
},

"1": {
    content: `
        <div class="helper-flex">
            <div>
                This is the Explore option (Floor Mode). Click on any icon to move to that location.
            </div>

            <div><img class="helper-gif" src="./Helper/Selecting_GSAP_Explore_Mode.gif"/></div>
        </div>

        <hr>

        <div class="helper-flex">
            <div>
                Click on the Floor option to view the cross-section of each floor.
            </div>

            <div><img class="helper-gif" src="./Helper/Floor_Option_Explore_mode.gif"/></div>
        </div>

        <hr>

        <div class="helper-flex">
            <div>
                Enable the <u>Pop-Up Option</u> from the top-right corner to view information about locations and objects.
                You may also click on individual pop-ups for more details.
            </div>

            <div><img class="helper-gif" src="./Helper/Frustum_Option_Edxplore_Floor_Mode.gif"/></div>
        </div>
    `
},

"1.1": {
    content: `
        <div class="helper-flex">
            <div>
                Click on any visible icon to navigate through locations one by one.
            </div>

            <div><img class="helper-gif" src="./Helper/GSAP_Mode_Explore_Mode.gif"/></div>
        </div>

        <hr>

        <div class="helper-flex">
            <div>
                Enable or disable clickable pop-ups to view more information about objects and locations.
            </div>

            <div><img class="helper-gif" src="./Helper/Frustum_Option_GSAP_Mode_Explore.gif"/></div>
        </div>

        <hr>

        <div class="helper-flex">
            <div>
                Enable or disable GSAP transitions for better visibility and smoother navigation.
            </div>

            <div><img class="helper-gif" src="./Helper/GSAP_Disable_Explore_mode.gif"/></div>
        </div>
    `
},

"2": {
    content: `
        <div class="helper-flex">
            <div><img class="helper-gif" src="./Helper/Search_menu_Options_Images.png"/></div>

            <div>
                <ul>
                    <li>
                        <b>Shelf Search</b> :
                        <p style="font-weight:550;">
                            Used to locate the correct bookshelf.
                        </p>
                    </li>

                    <li>
                        <b>Quick Search</b> :
                        <p style="font-weight:550;">
                            Quickly locate rooms, machines, washrooms, emergency facilities, and more.
                        </p>
                    </li>

                    <li>
                        <b>Locate Manually</b> :
                        <p style="font-weight:550;">
                            Manually select and navigate to any location inside the library.
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    `
},

"2.1": {
    content: `
        <div class="helper-flex">
            <div>
                Search for a shelf using the Call Number of a book.
                Each call number corresponds to a unique bookshelf.
                <br><br>
                Example: Call Number <b>234.234</b>
            </div>

            <div><img class="helper-gif" src="./Helper/Searching_through_call_number.gif"/></div>
        </div>

        <hr>

        <div class="helper-flex">
            <div>
                Search shelves based on book subjects.
                Multiple bookshelves may exist for a single subject.
            </div>

            <div><img class="helper-gif" src="./Helper/Searching_through_subjects.gif"/></div>
        </div>
    `
},

"2.2": {
    content: `
        <div class="helper-flex">
            <div>
                Select the type of facility you want to locate, such as dustbins, rooms, emergency facilities, and more.
                In this example, the Dustbin option is selected.
            </div>

            <div>
                <img src="./Helper/Quick_Search_Selecting_Dustbin.gif" class="helper-gif"/>
            </div>
        </div>
    `
},

"2.8": {
    content: `
        <div class="helper-flex">
            <div>
                Choose the destination bookshelf after selecting the subject.
                Since multiple bookshelves may exist for a subject, you must choose the required shelf.
            </div>

            <div>
                <img src="./Helper/Selecting_GSAP_Subejctws.gif" class="helper-gif"/>
            </div>
        </div>
    `
},

"2.3": {
    content: `
        <div class="helper-flex">
            <div>
                Manually select a destination location.
                This may include locations both inside and outside the library.
            </div>

            <div>
                <img src="./Helper/Manually_Select_The_Destination.gif" class="helper-gif"/>
            </div>
        </div>
    `
},

"2.7": {
    content: `
        <div class="helper-flex">
            <div>
                Choose one of the available GSAP destinations for the selected quick search option.
                For example, after selecting Dustbin, choose the specific dustbin you want to navigate to.
            </div>

            <div>
                <img src="./Helper/Selecting_Quick_Search_GSAP.gif" class="helper-gif"/>
            </div>
        </div>
    `
},

"2.4": {
    content: `
        <div class="helper-flex">
            <div>
                Choose the starting location from where you want to begin navigation toward the destination.
            </div>

            <div>
                <img src="./Helper/Selecting_Quick_Search_GSAP.gif" class="helper-gif"/>
            </div>
        </div>
    `
},

"2.5": {
    content: `
        <p>
            The path between the starting location and destination is now displayed.
            You may click on any GSAP point on any floor to walk through the path interactively.
        </p>
    `
},

"2.6": {
    content: `
        <div class="helper-flex">
            <div>
                Click on the next GSAP point one by one to move from the starting location to the destination.
                By default, the camera always faces the next GSAP point.
            </div>

            <div>
                <img src="./Helper/Move_to_shelf.gif" class="helper-gif"/>
            </div>
        </div>
    `
},

"3": {
    content: `
        <p>
            These are planned features that could not be fully completed during development.
            A brief description of each feature is provided below.
        </p>

        <ul>
            <li>
                <b>Seat Occupancy</b> :
                <p style="font-weight:550;">
                    Helps users identify available and occupied seats inside the library.
                </p>
            </li>

            <li>
                <b>Charging Port Availability</b> :
                <p style="font-weight:550;">
                    Displays the availability status of charging ports across the library.
                </p>
            </li>

            <li>
                <b>Fans to Switch Mapping</b> :
                <p style="font-weight:550;">
                    Helps users identify the correct switch corresponding to a particular fan,
                    especially useful on the second floor.
                </p>
            </li>
        </ul>
    `
},

"3.1": {
    content: `
        <div class="helper-flex">
            <div>This feature allows users to view the occupancy status of tables across the library. Occupied tables are highlighted in red, while available tables are highlighted in green. You can check table availability on each floor as shown below:</div>

            <div><img src="" class="helper-gif"/></div>
        </div>
    `
},

"3.2": {
    content: `
        This feature allows you to view charging ports across the library and identify which ports are occupied and which are available. A demonstration using dummy data is shown below:
    `
},

"3.3": {
    content: `
        "This feature allows you to locate the switch corresponding to a particular fan. A demonstration for this feature is currently unavailable."
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

