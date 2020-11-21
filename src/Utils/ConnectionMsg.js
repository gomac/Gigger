import React, {Component} from 'react';
import {Text, SafeAreaView, View} from 'react-native';
import {NetworkContext} from './NetworkProvider';

export default class ConnectionMsg extends Component {
  render() {
    return (
      <NetworkContext.Consumer>
        {isConnected => (
          <View>
            {!isConnected && (
              <SafeAreaView>
                <Text
                  style={{
                    color: 'red',
                    fontSize: 16,
                    backgroundColor: 'white',
                  }}>
                  No Internet connection found
                </Text>
              </SafeAreaView>
            )}
          </View>
        )}
      </NetworkContext.Consumer>
    );
  }
}
