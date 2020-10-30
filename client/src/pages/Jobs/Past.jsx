import {
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import api from '../../api';
import { useStore } from '../../utilities/store';


const Upcoming = () => {
  const [bids, setBids] = useState([]);
  const store = useStore();

  useEffect(() => {
    api.bids.getCaretakerBids(store.user.username).then((x) => setBids(x));
  }, [store.user.username]);

  return (
    <>
      <Paper style={{ margin: 30, padding: 30 }}>
        <Typography>{'Status: Completed'}</Typography>
      </Paper>
      <List>
        {bids
          .filter((bid) => bid.status === 'Completed')
          .map((bid) => {
            return (
              <Paper style={{ margin: 30, padding: 30 }} key={bids.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Typography component="span" variant="h3" color="Primary">
                        {`${bid.petname}`}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="textPrimary">
                          {`${bid.petownerusername}`}
                        </Typography>
                        {` Secondary`}
                      </>
                    }
                  />
                </ListItem>
              </Paper>
            );
          })}
      </List>
    </>
  );
};

export default Upcoming;
