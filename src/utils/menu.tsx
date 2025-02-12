import setting from "../assets/settings.svg";
import manageP from "../assets/mangeP.svg";
import devT from "../assets/devT.svg";
import projectA from "../assets/projectA.svg";
import document from "../assets/document.svg";
import inbox from "../assets/inbox.svg";
import task from "../assets/task.svg";
import secured from "../assets/secured.svg";
import development from "../assets/development.svg";
import deployement from "../assets/deployment.svg";
import billing from "../assets/billing.svg";

import manageA from "../assets/manage-projectsA.svg";

import devA from "../assets/dev-teamsA.svg";
import projectAA from "../assets/project-assistanceA.svg";
import documentA from "../assets/documentsA.svg";
import inboxA from "../assets/inboxA.svg";
import taskA from "../assets/tasksA.svg";
import securedA from "../assets/secured-storeA.svg";
import developmentA from "../assets/developmentA.svg";
import deployementA from "../assets/deploymentA.svg";
import billingA from "../assets/project-billingA.svg";
import settingA from "../assets/settingsA.svg";

export const Menus = [
  {
    title: "Manage Project",
    icon: manageP,
    link: "/manage-project",
    activeImg: manageA,
    role: "client",
  },
  {
    title: "View Project",
    icon: manageP,
    link: "/view-project",
    activeImg: manageP,
    role: "developer",
  },
  {
    title: "Dev Teams",
    icon: devT,
    link: "/dev-teams",
    activeImg: devA,
    role: "client",
  },
  {
    title: "Project Assistant",
    icon: projectA,
    link: "/project-assistant",
    activeImg: projectAA,
  },
  {
    title: "Documents",
    icon: document,
    link: "/documents",
    activeImg: documentA,
  },
  { title: "Inbox", icon: inbox, link: "/inbox", activeImg: inboxA },
  { title: "Tasks", icon: task, link: "/tasks", activeImg: taskA },
  {
    title: "Secured Store",
    icon: secured,
    link: "/secured-store",
    activeImg: securedA,
  },
  {
    title: "Development",
    icon: development,
    link: "/development",
    activeImg: developmentA,
  },
  {
    title: "Deployment",
    icon: deployement,
    link: "/deployment",
    activeImg: deployementA,
  },

  {
    title: "Project Billing",
    icon: billing,
    link: "/project-billing",
    activeImg: billingA,
  },
  {
    title: "Settings",
    icon: setting,
    link: "/settings",
    activeImg: settingA,
  },
];
