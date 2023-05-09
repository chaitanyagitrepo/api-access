# **/// WARNING ///**

**DO NOT RUN THIS WITHOUT GETTING APPROVAL FROM THE OWNER OF THE TARGET ENVIRONMENT!!**

---

# sf-guest-api-check

Checks a SF URL for a guest user API security misconfiguration.

To avoid package-lock.json conflicts, you can disable updates to the file by running `npm config set package-lock false`

## Instructions

---

## Requirements

1. Node.js v14 +
2. NPM v7+

## Setup

1. Clone this project
2. `cd [project directory]`
3. `npm install`

## Running the utlitiy

It's recommended to use the WEB UI, but you can also use the CLI.

### **Web UI **

The easiest way to get up and running.

1. If you want to use the web UI, run: `node web`
2. Open a browser and navigate to `http://localhost:3000` (it will open automatically, but just in case)
3. Enter the URL of the site you want to test (e.g. `https://mydomain.my.site.com/communityName`)
4. Click the `Submit` button

You can also now share the URL with others and they can run the test against the same site.

- After you submit the form, the URL in the browser will include a hash. That hash includes the settings you entered in the form.
- Copy the URL and share it with others. When they open the URL, the form will be pre-populated with the settings you entered.

![Web UI](../../blob/docs/docs/web-ui.png?raw=true "Web UI")

### Using .env

If you want to just run the full suite using `.env` settings:

1. Create .env (use .env.sample as your example file)
2. execute `node run`

### **CLI**

If you want to use the CLI:

1. execute `node cli` with the desired switches _`-u https://sitedomain.url` is required_

**Example:**

This will query the site `https://mydomain.my.site.com/communityName` for all sObjects and return the first record of each:

- `node cli -u https://mydomain.my.site.com -s communityName -a -c 1 `

#### **CLI Switches**

```
  -u, --host-url                 Host URL                             [required]

  -s, --site-name                Community Site Prefix                  [string]

  -a, --query-all, --all         Query CRUD permissions for all sObjects
                                 returned from Config call
                                                      [boolean] [default: false]

  -e, --entity, --sObject        Query the specified sObject (Case Sensitive)
                                                                        [string]

  -c, --count, --pageSize        Will query record data and limit to the
                                 specified count           [number] [default: 0]

  -o, --output                   Output Directory [Default:
                                 ./reports/<hostname>/files...]
                                                                        [string]

  -t, --tls-reject-unauthorized  Reject calls when SSL certificate check fails
                                                                       [boolean]

  -h, --help                     Show help                             [boolean]
```

### **.env**

```
HOST=https://hc-erm-tso-1732453466-23523-fd7d.force.com
SITE=/erm

/* If using a custom domain and for some reason the */
/* SSL certificate is self-signed,                  */
/* set this to 0                                    */
TLS_REJECT_UNAUTHORIZED=true
```

**HOST**

This is the domain of the _Site_ with anonymous access you are testing.
For example, if you have a community configured with anonymous access
enabled and the community URL ends in `https://example.com/mysite/s`,
then try setting the host to `https://example.com`

**SITE**

This is the community or site suffix (so using the example above, you would set it to `/mysite`

## ToDo

- [x] Add support for command line arguments so you don't have to set .env (but you can still use .env)
- [x] Report out to a file
- [ ] DON'T report out to a file and instead support a web UI to display results

Based on information provided here: https://www.varonis.com/blog/abusing-salesforce-communities
