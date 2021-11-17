import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';


export default function Add({ navigation }) {
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const galleryStatus = await ImagePicker.requestCameraRollPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');


    })();
  }, []);

  // a function for taking picture trigerred by take-picture button down in the return statement below the flip image button
  const takePicture = async () => {
    // camera is a state variable set using useState() up top
    // if camera exists and is populated with something
    if (camera) {
      const data = await camera.takePictureAsync(null);
      // when we take a picture it is generally saved in a temporary file inside our phone and that temporary file has a uri for your device which will be the following one
      setImage(data.uri);
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      // mediatypeoptions says which type of media are you accepting like videos, images, all etc. we are using just images in this project
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };


  if (hasCameraPermission === null || hasGalleryPermission === false) {
    return <View />;
  }
  // if the user doesn't have both the permissions
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.cameraContainer}>
        <Camera
          // giving camera component access to the camera state variable
          ref={ref => setCamera(ref)}
          style={styles.fixedRatio}
          type={type}
          // ratio is a prop in the expo documentation that we can use
          // (string) Android only. A string representing aspect ratio of the preview, eg. 4:3, 16:9, 1:1 
          ratio={'1:1'} />
      </View>
      
      {/* this button flips the image */}
      <Button
        title="Flip Image"
        onPress={() => {
          setType(
            // if image type is back then it will flip it to front and vice versa
            type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
          );
        }}>
      </Button>
      {/* this button takes a picture */}
      <Button title="Take Picture" onPress={() => takePicture()} />
      {/* this button picks an image from the gallery */}
      <Button title="Pick Image From Gallery" onPress={() => pickImage()} />
      <Button title="Save" onPress={() => navigation.navigate('Save', { image })} />
      {/* image is a state variable, the following condition says if the image exists then show the following tag otherwise don't */}
      {image && <Image source={{ uri: image }} style={{ flex: 1 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1
  }

})