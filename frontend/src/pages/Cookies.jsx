import React from 'react'

export default function cookies() {
  return (
    <div>
        <h3 style={{textAlign:"center"}}>Cookies Agreement</h3>
        <div>
        A cookie is a simple file that originates from a site and is stored on a customer's computer by the browser. They typically contain a name and a value that identifies the client as a specific user with specific permissions to the site.
        </div>
        <div>
        The cookie is connected to the source domain in such a way that only the source domain can access the information stored in it. Third-party servers can neither read nor change the contents of cookies for that domain on the user's computer.
        </div>

        <div>
        A former Netscape employee invented cookies in 1993.
        </div>

        <div>
        Cookie-based authentication is stateful, meaning that authentication or session information must be saved on both the client and the server. This information server is generally recorded in the database, and the front-end is saved in a cookie.



        </div>
        <div>
        The general process of verification is as follows:
        <ul>
            <li>
                1. The user enters login credentials;
            </li>
            <li>
                2. The server verifies that the credentials are correct, creates a session, and then stores the session data in a database;
            </li>
            <li>
                3. A cookie with a session ID is placed in the user's browser;
            </li>
            <li>
                4. In subsequent requests, the server validates the session ID against the database and continues processing if the authentication passes;
            </li>
            <li>
                5. Once the user logs out, the server and client destroy the session at the same time.
            </li>
        </ul>





        </div>
       








    </div>
  )
}
