import "@fortawesome/free-solid-svg-icons";
import "@fortawesome/free-regular-svg-icons";
//https://github.com/FortAwesome/Font-Awesome/issues/19348
const { library, config } = require("@fortawesome/fontawesome-svg-core");
import {
  faArrowRightFromBracket,
  faUpload,
  faPlus,
  faMinus,
  faFileImport,
  faBackward,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Add icons here to the library then use them in react:
 * `<FontAwesomeIcon icon={"minus"} width={18} />`
 */

library.add(
  faArrowRightFromBracket,
  faUpload,
  faPlus,
  faMinus,
  faFileImport,
  faBackward
);
