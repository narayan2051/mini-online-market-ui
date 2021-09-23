export const Cookies = {
  writeCookie(name, value, hours, path) {
    try {
      if (hours) {
        var date = new Date();
        date.setTime(date.getTime() + hours * 60 * 60 * 1000);
        var expires = "; expires=" + date.toGMTString();
      } else {
        // eslint-disable-next-line no-redeclare
        var expires = "";
      }
      let pathName = path ? path : "/";
      document.cookie = name + "=" + value + expires + "; path=" + pathName;
    } catch (err) {
      console.error(`Error writing to cookie`, name, value);
    }
  },
  readCookie(name) {
    try {
      let nameEquals = name + "=";
      let cookieArray = document.cookie.split(";");
      for (let i = 0; i < cookieArray.length; i++) {
        let cookieToBeChecked = cookieArray[i].trim();
        if (cookieToBeChecked.indexOf(nameEquals) === 0)
          return cookieToBeChecked.substring(
            nameEquals.length,
            cookieToBeChecked.length
          );
      }
    } catch (err) {
      console.error(`Error getting from cookie`, name);
      return undefined;
    }
  },
  deleteCookie(name) {
    Cookies.writeCookie(name, "", -1);
  }
};