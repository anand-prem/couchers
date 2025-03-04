import {
  CardActions,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Skeleton } from "@material-ui/lab";
import Alert from "components/Alert";
import Button from "components/Button";
import Datepicker from "components/Datepicker";
import TextField from "components/TextField";
import {
  ARRIVAL_DATE,
  CANCEL,
  DEPARTURE_DATE,
  MEETUP_ONLY,
  OVERNIGHT_STAY,
  REQUEST,
  REQUEST_DESCRIPTION,
  SEND,
  sendRequest,
  STAY_TYPE_A11Y_TEXT,
} from "features/constants";
import { useUser } from "features/userQueries/useUsers";
import { Error as GrpcError } from "grpc-web";
import { User } from "pb/api_pb";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { service } from "service";
import { CreateHostRequestWrapper } from "service/requests";
import { isSameOrFutureDate } from "utils/date";

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    paddingTop: theme.spacing(1),
  },
  form: {
    "& > *": {
      marginTop: theme.spacing(2),
    },
  },
  title: {
    marginBottom: theme.spacing(1),
  },
  request: {
    display: "flex",
    flexDirection: "row",
  },
  date: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  requestField: {
    marginTop: theme.spacing(2),
  },
  send: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: theme.spacing(2),
  },
}));

interface NewHostRequestProps {
  setIsRequestSuccess: (value: boolean) => void;
  setIsRequesting: (value: boolean) => void;
  user: User.AsObject;
}

export default function NewHostRequest({
  setIsRequestSuccess,
  setIsRequesting,
  user,
}: NewHostRequestProps) {
  const classes = useStyles();
  const isPostBetaEnabled = process.env.REACT_APP_IS_POST_BETA_ENABLED;
  const [numVisitors, setNumVisitors] = useState(1);

  const {
    control,
    errors,
    getValues,
    handleSubmit,
    register,
    setValue,
    watch,
  } = useForm<CreateHostRequestWrapper>({
    defaultValues: { toUserId: user.userId },
  });

  useEffect(() => register("toUserId"));

  const { error, mutate } = useMutation<
    number,
    GrpcError,
    CreateHostRequestWrapper
  >(
    (data: CreateHostRequestWrapper) =>
      service.requests.createHostRequest(data),
    {
      onSuccess: () => {
        setIsRequesting(false);
        setIsRequestSuccess(true);
      },
    }
  );

  const { isLoading: hostLoading, error: hostError } = useUser(user.userId);

  const onSubmit = handleSubmit((data) => mutate(data));

  const guests = Array.from({ length: 8 }, (_, i) => {
    const num = i + 1;
    return (
      <MenuItem key={num} value={num} ref={register}>
        {num}
      </MenuItem>
    );
  });

  const watchFromDate = watch("fromDate", new Date());
  useEffect(() => {
    if (isSameOrFutureDate(watchFromDate, getValues("toDate"))) {
      setValue("toDate", tomorrow(watchFromDate));
    }
  });

  function tomorrow(date: Date): Date {
    const tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }

  return (
    <>
      <Typography variant="h1">
        {hostLoading ? <Skeleton width="100" /> : sendRequest(user.name)}
      </Typography>
      {error && <Alert severity="error">{error.message}</Alert>}
      {hostError ? (
        <Alert severity={"error"}>{hostError}</Alert>
      ) : (
        <form onSubmit={onSubmit}>
          <div className={classes.request}>
            {isPostBetaEnabled && (
              <Controller
                name="stayType"
                control={control}
                defaultValue={1}
                render={({ onChange, value }) => (
                  <RadioGroup
                    aria-label={STAY_TYPE_A11Y_TEXT}
                    name="stay-radio"
                    value={value}
                    onChange={(value) => onChange(value)}
                  >
                    <FormControlLabel
                      value={OVERNIGHT_STAY}
                      control={<Radio />}
                      label={OVERNIGHT_STAY}
                    />
                    <FormControlLabel
                      value={MEETUP_ONLY}
                      control={<Radio />}
                      label={MEETUP_ONLY}
                    />
                  </RadioGroup>
                )}
              />
            )}
            <Datepicker
              control={control}
              error={!!errors.fromDate}
              helperText={errors?.fromDate?.message}
              id="from-date"
              inputRef={register}
              label={ARRIVAL_DATE}
              name="fromDate"
            />
            <Datepicker
              className={classes.date}
              control={control}
              error={!!errors.toDate}
              helperText={errors?.toDate?.message}
              id="to-date"
              inputRef={register}
              label={DEPARTURE_DATE}
              minDate={tomorrow(watchFromDate)}
              name="toDate"
            />
            {isPostBetaEnabled && (
              <Select
                name="visitorCount"
                value={numVisitors}
                onChange={(event) => setNumVisitors(Number(event.target.value))}
              >
                {guests}
              </Select>
            )}
          </div>
          <TextField
            id="text"
            className={classes.requestField}
            label={REQUEST}
            name="text"
            rows={6}
            inputRef={register}
            multiline
            fullWidth
            placeholder={REQUEST_DESCRIPTION}
          />
          <CardActions className={classes.send}>
            <Button onClick={() => setIsRequesting(false)}>{CANCEL}</Button>
            <Button type="submit" onClick={onSubmit}>
              {SEND}
            </Button>
          </CardActions>
        </form>
      )}
    </>
  );
}
