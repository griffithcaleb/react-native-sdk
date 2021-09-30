'use strict'

import React, { useState, useEffect, useRef } from 'react'
import {
   View,
   Text,
   Animated,
   PanResponder,
   StyleSheet
} from 'react-native'

import {
   InboxRowViewModel,
   IterableInboxClickableRow,
   IterableInboxCustomizations
} from '.'

type SwipeableRowProps = {
   key: string,
   index: number,
   last: boolean,
   rowViewModel: InboxRowViewModel,
   messageListItemLayout: Function,
   customizations: IterableInboxCustomizations,
   // swipingCheck: Function,
   deleteRow: Function,
   handleMessageSelect: Function,
   contentWidth: number,
   height: number,
   isPortrait: boolean
}

const IterableInboxSwipeableRow = ({
   index,
   last,
   rowViewModel,
   messageListItemLayout,
   customizations,
   //swipingCheck,
   deleteRow,
   handleMessageSelect,
   contentWidth,
   isPortrait
}: SwipeableRowProps) => {
   const position = useRef(new Animated.ValueXY()).current
   const [height, setHeight] = useState<number>(100) 
   const [width, setWidth] = useState<number>(100) 

   let { textContainer, deleteSlider, textStyle } = styles

   deleteSlider = (isPortrait) ? deleteSlider : {...deleteSlider, paddingRight: 40 } 
   
   let [scrollStopped, setScrollStopped] = useState(false)

   const scrollThreshold = contentWidth / 15
   const FORCING_DURATION = 350

   //stops scrolling and enables swiping when threshold is reached
   const enableScrollView = (isEnabled: boolean) => {
      if(scrollStopped !== isEnabled) {
         // swipingCheck(isEnabled)
         // setScrollStopped(isEnabled)
      }
   }

   //If user swipes, either complete swipe or reset 
   const userSwipedLeft = (gesture : any) => {
      if(gesture.dx < -0.6 * contentWidth) {
         completeSwipe()   
      } else {
         resetPosition()
      }
   }

   const completeSwipe = () => {
      const x = -2000
      Animated.timing(position, {
         toValue: {x, y: 0},
         duration: FORCING_DURATION,
         useNativeDriver: false   
      }).start(() => deleteRow(rowViewModel.inAppMessage.messageId))
   }
   
   const resetPosition = () => {
      Animated.timing(position, {
         toValue: { x: 0, y: 0 },
         duration: 200,
         useNativeDriver: false
      }).start()
   }
   
   const panResponder = useRef(
      PanResponder.create({
         onStartShouldSetPanResponder: () => false,
         onMoveShouldSetPanResponder: () => true,
         onPanResponderTerminationRequest: () => false,
         onPanResponderGrant: () => {
            position.setOffset({ 
               x: position.x._value, 
               y: 0 
            })
            position.setValue({ x: 0, y: 0 })
         },
         onPanResponderMove: (event, gesture) => {
            if(gesture.dx <= -scrollThreshold) {
               //enables swipeing when threshold is reached
               enableScrollView(true)
               //threshold value is deleted from movement
               const x = gesture.dx + scrollThreshold
               //position is set to the new value
               position.setValue({x, y: 0})
            }
         },
         onPanResponderRelease: (event, gesture) => {
            position.flattenOffset()
            if(gesture.dx < 0) {
               userSwipedLeft(gesture) 
            }
         },
         onPanResponderTerminate: () => {
            Animated.spring(position, {
               toValue: {x: 0, y: 0},
               useNativeDriver: false
            }).start()
         }
      })
   ).current

   return(
      <View>
         <Animated.View style={deleteSlider}>
            <Text style={textStyle}>DELETE</Text>   
         </Animated.View>
         <Animated.View 
            style={[textContainer, position.getLayout()]}
            {...panResponder.panHandlers}
         >
            <IterableInboxClickableRow
               index={index}
               last={last}
               rowViewModel={rowViewModel}
               messageListItemLayout={messageListItemLayout}
               customizations={customizations}
               handleMessageSelect={(messageId: string, index: number) => handleMessageSelect(messageId, index)}
               isPortrait={isPortrait}
            />   
         </Animated.View>
      </View>   
   )
}

const styles = StyleSheet.create({
   textContainer: {
      width: '100%',
      zIndex: 2
   },

   deleteSlider: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingRight: 10,
      backgroundColor: 'red',
      position: 'absolute',
      elevation: 3,
      width: '100%',
      height: 120,
      zIndex: 1
   },

   textStyle: {
      fontWeight: 'bold',
      fontSize: 15,
      color: 'white'
   }
})

export default IterableInboxSwipeableRow