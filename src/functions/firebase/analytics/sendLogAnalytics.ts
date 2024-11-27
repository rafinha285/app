import Pages from "../../../types/pagesType";
import {analytcs} from "../firebaseApp";
import { logEvent } from "firebase/analytics";

export function logPage(page:Pages): void {
    logEvent(analytcs,"page_view",{page_title:page,page_path:document.location.pathname});
}
