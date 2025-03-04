import {
  AppBar,
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  Toolbar,
} from "@material-ui/core";
import classNames from "classnames";
import { CloseIcon, MenuIcon } from "components/Icons";
import ExternalNavButton from "components/Navigation/ExternalNavButton";
import { useAuthContext } from "features/auth/AuthProvider";
import useAuthStyles from "features/auth/useAuthStyles";
import BugReport from "features/BugReport";
import React from "react";
import CouchersLogo from "resources/CouchersLogo";
import {
  couchersRoute,
  forumRoute,
  logoutRoute,
  messagesRoute,
  searchRoute,
  userRoute,
} from "routes";
import makeStyles from "utils/makeStyles";

import { ABOUT, COUCHERS, FORUM, LOG_OUT } from "../../constants";
import NavButton from "./NavButton";

const menu = [
  {
    name: "Dashboard",
    route: "/",
  },
  {
    name: "Messages",
    route: messagesRoute,
  },
  {
    name: "Search",
    route: searchRoute,
  },
  {
    name: "Profile",
    route: userRoute,
  },
];

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  appBar: {
    bottom: "auto",
    top: 0,
  },
  flex: {
    display: "flex",
    flex: 0,
    justifyContent: "flex-start",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    width: "auto",
  },
  drawerPaper: {
    padding: theme.spacing(2),
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    justifyContent: "space-between",
  },
  drawerTitle: {
    alignSelf: "center",
    fontSize: "1.5rem",
    fontWeight: "bold",
    paddingLeft: theme.spacing(1),
  },
  gutters: {
    [theme.breakpoints.up("md")]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
    justifyContent: "space-between",
    paddingLeft: 0,
    paddingRight: 0,
  },
  nav: {
    alignItems: "center",
    display: "flex",
    flex: 0,
  },
  icon: {
    marginLeft: theme.spacing(1),
  },
  bug: {
    alignItems: "center",
    display: "flex",
    justifyContent: "flex-end",
    [theme.breakpoints.down("md")]: {
      paddingRight: theme.spacing(2),
    },
  },
  title: {
    alignSelf: "center",
    fontWeight: "bold",
  },
}));

export default function Navigation() {
  const classes = useStyles();
  const authClasses = useAuthStyles();
  const authenticated = useAuthContext().authState.authenticated;
  const [open, setOpen] = React.useState(false);

  const drawerItems = (
    <div>
      <List>
        {menu.map(({ name, route }) => (
          <ListItem button key={name}>
            <NavButton route={route} label={name} labelVariant="h2" />
          </ListItem>
        ))}
        <ListItem button key="about">
          <ExternalNavButton
            route={couchersRoute}
            label={ABOUT}
            labelVariant="h2"
          />
        </ListItem>
        <ListItem button key="forum">
          <ExternalNavButton
            route={forumRoute}
            label={FORUM}
            labelVariant="h2"
          />
        </ListItem>
        <ListItem button key="logout">
          <NavButton route={logoutRoute} label={LOG_OUT} labelVariant="h2" />
        </ListItem>
      </List>
    </div>
  );

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  if (!authenticated) {
    return null;
  }
  return (
    <AppBar
      position="fixed"
      classes={{
        root: classes.appBar,
      }}
      color="inherit"
    >
      <Toolbar
        classes={{
          gutters: classes.gutters,
        }}
      >
        <div className={classes.nav}>
          <Hidden mdUp>
            <IconButton
              className={classes.icon}
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              variant="temporary"
              anchor="left"
              open={open}
              onClick={handleDrawerClose}
              ModalProps={{
                keepMounted: true, // better open performance on mobile
                onBackdropClick: handleDrawerClose,
              }}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <div className={classes.drawerHeader}>
                <div
                  className={classNames(authClasses.logo, classes.drawerTitle)}
                >
                  {COUCHERS}
                </div>
                <IconButton
                  className={classes.icon}
                  aria-label="close drawer"
                  onClick={handleDrawerClose}
                >
                  <CloseIcon />
                </IconButton>
              </div>
              {drawerItems}
            </Drawer>
          </Hidden>
          <CouchersLogo />
          <Hidden smDown>
            <div className={authClasses.logo}>{COUCHERS}</div>
          </Hidden>
          <Hidden smDown>
            <div className={classes.flex}>
              {menu.map((item) => (
                <NavButton
                  route={item.route}
                  label={item.name}
                  key={`${item.name}-nav-button`}
                />
              ))}
            </div>
          </Hidden>
        </div>
        <div className={classes.bug}>
          <Hidden smDown>
            <ExternalNavButton
              route={couchersRoute}
              label={ABOUT}
              labelVariant="h3"
            />
            <ExternalNavButton
              route={forumRoute}
              label={FORUM}
              labelVariant="h3"
            />
            <NavButton route={logoutRoute} label={LOG_OUT} />
          </Hidden>
          <BugReport />
        </div>
      </Toolbar>
    </AppBar>
  );
}
