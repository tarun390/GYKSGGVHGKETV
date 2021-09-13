import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions'
import { FontAwesome, Ionicons,MaterialCommunityIcons } from '@expo/vector-icons';
  
export default class CameraPage extends React.Component {
    camera = null;

    state = {
        hasCameraPermission: null,
    };

    async componentDidMount() {
        const camera = await Permissions.askAsync(Permissions.CAMERA);
        const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        const hasCameraPermission = (camera.status === 'granted' && audio.status === 'granted');
        this.setState({ hasCameraPermission });
    };

    takePicture = async () => {
        if (this.camera) {
        let photo = await this.camera.takePictureAsync();
        var image=photo.uri
        this.uploadImage(image)
        }
    }

    uploadImage = async (url) => {
        const fileToUpload = url;
        const data = new FormData();
        data.append('name', 'Image Upload');
        data.append('file_attachment', fileToUpload);
            fetch('https://f292a3137990.ngrok.io/predict-digit'),
            {
                method: 'post',
                headers: {
                'Content-Type': 'multipart/form-data; ',
                },
                body: data,

            }
        let responseJson = await res.json();

        if (responseJson.status == 1) {
            alert('Upload Successful');
        }
    };

    render() {
        const { hasCameraPermission } = this.state;

        if (hasCameraPermission === null) {
            return <View />;
        } 
        else if (hasCameraPermission === false) {
            return  <Text>Access to camera has been denied.</Text>;
        } 
        else {
        return (
            <View style={{flex:1,alignItems:'flex-end'}}>
                
                <Camera
                    style={styles.preview}
                    ref={ref => {this.camera = ref}}   
                />
                
                <TouchableOpacity
                style={{
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                }}
                onPress={()=>this.takePicture()}
                >
                <FontAwesome
                    name="camera"
                    style={{ color: "#fff", fontSize: 40}}
                />
                </TouchableOpacity>
            </View>
        );
        
        };  
    };
};
const { width: winWidth, height: winHeight } = Dimensions.get('window');

export default StyleSheet.create({
    preview: {
        height: winHeight,
        width: winWidth,
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
});