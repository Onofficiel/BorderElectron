
function maxwin() {
  var win=chrome.app.window.current()
  win.isMaximized()?win.restore():win.maximize()
}


        let currentPage = 0;
        let settings = {};

        let page = [
          {
            content: `
            <h1>Welcome to the Border Setup Program !</h1>
            Click next to start the configuration of Border or back to use the default one.
            `,
          },
          {
            content: `
            <h1>Theme of Border</h1>
            <b>Primary : </b><input class="border-setup-primary-input" type="color" value="${
              "#4e2493"
            }"></input><br>
            <b>Secondary : </b><input class="border-setup-secondary-input" type="color" value="${
              "#ffe5fb"
            }"></input>
            `,
            save: [
              {
                name: "primary",
                value: ".border-setup-primary-input",
              },
              {
                name: "secondary",
                value: ".border-setup-secondary-input",
              },
            ],
          },
          {
            content: `
            <h1>So here we are !</h1>
            <div class="border-setup-get-settings"></div>
            `,
          },
        ];

        document
          .querySelector(".border-setup-back")
          .addEventListener("click", () => {
            goto(--currentPage);
          });

        document
          .querySelector(".border-setup-next")
          .addEventListener("click", () => {
            if (!!page[currentPage].save) {
              for (let data of page[currentPage].save) {
                settings[data.name] =
                  document.querySelector(data.value).type === "checkbox"
                    ? document.querySelector(data.value).checked
                    : document.querySelector(data.value).value;
              }
            }
            goto(++currentPage);
          });

        const goto = (n) => {
          if (n >= page.length) {
            await finishInstallation()
              return window.close()
          }

          if (n < 0) {
            return window.close();
          }

          document.querySelector(".border-setup-panel").innerHTML =
            page[n].content;

          document
            .querySelectorAll(".border-setup-get-settings")
            .forEach((item) => {
              let settingsData = "";
              for (let key of Object.keys(settings)) {
                settingsData += key + ": " + settings[key] + "<br/>";
              }
              item.innerHTML = settingsData;
            });

          currentPage = n;
        };
        goto(0);

async function finishInstallation() {}

document.querySelector('.border-close').onclick=()=>{chrome.app.window.current().close();}
document.querySelector('.border-minimize').onclick=()=>{chrome.app.window.current().minimize();}
