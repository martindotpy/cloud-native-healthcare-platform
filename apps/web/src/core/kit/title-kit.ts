import { appShortName, defaultTitle } from "../constant/seo-constant"

export function getTitle(title?: string) {
  return title ? `${title} | ${appShortName}` : defaultTitle
}

export function removeAppNameFromTitle(title: string) {
  return title.replace(new RegExp(`\\s*\\|\\s*${appShortName}$`), "").trim()
}
