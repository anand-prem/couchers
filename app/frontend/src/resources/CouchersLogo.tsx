import { Chip, SvgIcon, SvgIconProps } from "@material-ui/core";
import makeStyles from "utils/makeStyles";

const useStyles = makeStyles((theme) => ({
  logo: {
    fill: theme.palette.secondary.main,
    height: theme.typography.pxToRem(50),
    width: theme.typography.pxToRem(50),
  },
  sticker: {
    fontSize: "0.8rem",
    position: "relative",
    left: "-1.8rem",
    top: "-1.2rem",
    transform: "rotate(15deg)",
  },
}));

export default function CouchersLogo(props: SvgIconProps) {
  const classes = useStyles();
  return (
    <>
      <SvgIcon
        {...props}
        className={classes.logo}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <g>
          <path
            d="M117.3,241c10.4,0,18.8,8.4,18.8,18.8s-8.4,18.8-18.8,18.8s-18.8-8.4-18.8-18.8C98.5,249.4,106.9,241,117.3,241
	              C117.3,241,117.3,241,117.3,241 M69,259.8c0,26.7,48.3,120.7,48.3,120.7s48.3-94,48.3-120.7c0-26.7-21.6-48.3-48.3-48.3
	              C90.6,211.5,69,233.1,69,259.8"
          />
          <path
            d="M413.5,259.8c0,10.4-8.4,18.8-18.8,18.8s-18.8-8.4-18.8-18.8s8.4-18.8,18.8-18.8
	              C405.1,241,413.5,249.4,413.5,259.8L413.5,259.8 M394.7,211.5c-26.7,0-48.3,21.6-48.3,48.3l0,0c0,26.7,48.3,120.7,48.3,120.7
	              s48.3-94,48.3-120.7C443,233.1,421.4,211.5,394.7,211.5"
          />
          <path
            d="M116.9,195.1c2.5-35.6,32-63.2,67.7-63.2h142.8c35.6,0,65.2,27.6,67.7,63.1h-0.4c-35.7,0-64.7,29-64.7,64.7l0,0
                c0,21,22.4,73.2,40.8,112.6H141.2C159.7,333,182,280.9,182,259.8c0-35.7-29-64.7-64.7-64.7c0,0,0,0,0,0L116.9,195.1z M317.9,284.7
                c0-1.4-0.2-2.9-0.7-4.2c-1.2-1.7-2-3.2-12.1,4.4c-10.1,7.6-25.9,17.1-50.9,18.5s-41.6-6.3-51-8.6c-3.4-0.9-5.3-0.4-6.1,0.8
                c-0.5,1.6-0.8,3.2-0.6,4.9c0.2,1.4,0.6,2.7,1.2,4c0.6,1.1,1.3,2.1,2.2,2.9c3.7,3.5,15.7,10.4,33.4,12.8c17.7,2.4,40.8,2.8,63.6-10.7
                c15-8.9,19.5-16.4,20.6-21C317.8,287.2,317.9,286,317.9,284.7z"
          />
        </g>
      </SvgIcon>
      <Chip
        color="primary"
        size="small"
        className={classes.sticker}
        label="Beta"
      />
    </>
  );
}
