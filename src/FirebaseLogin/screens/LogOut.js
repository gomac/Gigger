import React, {useEffect} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import auth from '@react-native-firebase/auth';

import {testProperties} from '../../Utils/TestProperties';

const LogOut = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    auth().signOut();
    setIsLoading(false);
  }, []);

  return (
    isLoading && (
      <View style={styles.splash} {...testProperties('Logout-screen')}>
        <Text>Logging out</Text>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LogOut;
