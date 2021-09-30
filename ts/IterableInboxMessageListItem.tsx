'use strict'

import React, {useState} from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'

import { InboxRowViewModel, IterableInboxCustomizations } from '.'

type MessageListItemProps = {
   last: boolean,
   rowViewModel: InboxRowViewModel,
   getHeight: Function,
   messageListItemLayout: Function,
   customizations: IterableInboxCustomizations,
   isPortrait: boolean
}

const defaultMessageListLayout = (
   last: boolean,
   rowViewModel: InboxRowViewModel, 
   customizations: IterableInboxCustomizations,
   isPortrait: boolean
) => {
   const messageTitle = rowViewModel.inAppMessage.inboxMetadata?.title ?? ""
   const messageBody = rowViewModel.inAppMessage.inboxMetadata?.subtitle ?? ""
   const messageCreatedAt = rowViewModel.createdAt
   const iconURL = rowViewModel.imageUrl

   const styles = StyleSheet.create({
      unreadIndicatorContainer: {
         height: '100%',
         flexDirection: 'column',
         justifyContent: 'flex-start'
      },
   
      unreadIndicator: { 
         width: 15,
         height: 15,
         borderRadius: 15 / 2,
         backgroundColor: 'blue',
         marginLeft: 10,
         marginRight: 5,
         marginTop: 7
      },

      unreadMessageIconContainer: {
         paddingLeft: 10
      },

      readMessageIconContainer: {
         paddingLeft: 30
      },
   
      messageContainer: {
         paddingLeft: 10
      },
   
      title: {
         fontSize: 22,
         paddingBottom: 10
      },
   
      body: {
         fontSize: 15,
         color: 'lightgray',
         width: contentWidth * 0.85,
         flexWrap: "wrap",
         paddingBottom: 10
      },
   
      createdAt: {
         fontSize: 12,
         color: 'lightgray'
      },
   
      messageRow: {
         flexDirection: 'row',
         backgroundColor: 'white',
         paddingTop: 10,
         paddingBottom: 10,
         width: '80%',
         height: 120,
         borderStyle: 'solid',
         borderColor: 'lightgray',
         borderTopWidth: 1
      }
   })

   const resolvedStyles = {...styles, ...customizations}

   let {
      unreadIndicatorContainer,
      unreadIndicator,
      unreadMessageIconContainer,
      readMessageIconContainer,
      messageContainer,
      title,
      body,
      createdAt,
      messageRow
   } = resolvedStyles

   unreadIndicator = (!isPortrait) ? {...unreadIndicator, marginLeft: 40} : unreadIndicator
   readMessageIconContainer = (!isPortrait) ? {...readMessageIconContainer, paddingLeft: 65} : readMessageIconContainer 

   function messageRowStyle(rowViewModel: InboxRowViewModel) {
      return last ? {...messageRow, borderBottomWidth: 1} : messageRow 
   }
      
   return(
      <View style={messageRowStyle(rowViewModel)} onLayout={(event) => getHeight(event.nativeEvent.layout)}>
         <View style={unreadIndicatorContainer}>
            {rowViewModel.read ? null : <View style={unreadIndicator}/>}
         </View>
         <View style={rowViewModel.read ? readMessageIconContainer : unreadMessageIconContainer}>
            <Image style={{height: 80, width: 80}} source={{uri: iconURL}}/>
         </View>
         <View style={messageContainer}>
            <Text style={title}>{messageTitle}</Text>
            <Text style={body}>{messageBody}</Text>
            <Text style={createdAt}>{messageCreatedAt}</Text>
         </View>
      </View>
   )
}

const IterableInboxMessageListItem = ({ 
   last, 
   rowViewModel,
   getHeight, 
   messageListItemLayout, 
   customizations,
   isPortrait
}: MessageListItemProps) => {

   return(
      messageListItemLayout(last, rowViewModel) ?
         messageListItemLayout(last, rowViewModel) :
         defaultMessageListLayout(last, rowViewModel, customizations, isPortrait)  
   )
}

export default IterableInboxMessageListItem