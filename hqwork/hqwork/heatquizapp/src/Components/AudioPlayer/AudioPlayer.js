import React from "react";
import ReactAudioPlayer from 'react-audio-player';
import {CloseOutlined} from '@ant-design/icons';
import { Space } from "antd";
import './index.css'
export function AudioPlayerComponent({URL}){
      
  return(
      <div>
        <ReactAudioPlayer
            src={URL}
            autoPlay
            controls
        />
      </div>
  )
}