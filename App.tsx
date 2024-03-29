import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, NativeModules, NativeEventEmitter, Platform} from 'react-native';
import React, { Component } from 'react';
import Fingerpush from 'fingerpush';

var FingerManager = Fingerpush;
const FingerManagerEmitter = new NativeEventEmitter(Fingerpush);

var userinfo = {};

class App extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            token : '',
            setDeviceResultText : '등록을 누르면 메세지가 표시됩니다.',
            onNotificationText : '푸시 메세지가 수신되면 여기에 나타나며, 푸시를 클릭한 후 "메세지 수신 확인"을 누르면 읽음 처리 결과 메세지가 여기에 표시됩니다.',
            checkPushText : '변수를 통해 특정 푸시 메세지를 읽음 처리할 수 있으며, "메세지 수신 확인"을 누르면 결과 메세지가 여기에 표시됩니다.',
            msgTag : "",
            mode : "",
            labelCode : "",
            getAppReportResultText : '앱 정보 확인을 누르면 앱에 설치된 정보를 여기에 표시합니다.',
            getDeviceInfoResultText : '디바이스 정보 가져오기를 누르면, 디바이스 타입, 푸시 수신 여부, 식별자 등의 정보를 여기에 표시합니다.',
            setTagResultText : '태그를 설정할 수 있으며, 결과 메세지를 여기에 표시합니다.',
            tag : '',
            getTagResultText : '설정된 태그를 가져와서 여기에 표시합니다.',
            getAllTagResultText : '설정된 태그를 전부 가져와서 여기에 표시합니다.',
            setIdentityResultText : '식별자를 설정할 수 있으며, 결과 메세지를 여기에 표시합니다.',
            identity : '',
            removeTagResultText : '입력한 태그를 삭제할 수 있으며, 그 결과 메세지를 여기에 표시합니다.',
            removeTag : '',
            removeAllTagResultText : '입력한 태그를 전부 삭제하며, 그 결과 메세지를 여기에 표시합니다.',
            removeIdentityResultText : '식별자를 삭제하며, 그 결과 메세지를 여기에 표시합니다.',
            setPushAliveResultText : '메세지 수신 여부를 설정할 수 있으며, 입력값은 true/false만 가능합니다.',
            isAlive : '',
            setAdvertisePushEnableResultText : '광고 메세지 수신 여부를 설정할 수 있으며, 입력값은 true/false만 가능합니다.',
            isAdAlive : '',
            uniqueId : '',
            isReceiveUniqueMessage : '',
            uniqueMessage : '',
            setUniqueIdentityResultText : '유니크한 식별자를 설정할 수 있으며, 결과 메세지를 여기에 표시합니다.',
            showInAppPushText : '인앱푸시를 보여줍니다.'
        }
    }
    
    UNSAFE_componentWillMount(){
        
        FingerManager.setAppKey('NXCB6XJK09U8');                                                   // 핑거푸시 앱키 등록
        FingerManager.setAppSecret('vv0iQl9GjCGr7yOO5m8kdVbhLgqZqYGT');                                      	     // 핑거푸시 앱시크릿 등록
        
        if (Platform.OS === "android") {    // Android
            
            FingerManagerEmitter.addListener('notification', function(value: Event) {                  // Android 푸시 수신 클릭 리스너
                console.log('userInfo' + JSON.stringify(value))

                const data = JSON.parse(value.toString())
                const src = data['data.src']
                
                if (src === 'fp') {                                                                  // 핑거푸시 여부 판단
                    console.log("src = " + src)
                    userinfo = value
                    this.setState({onNotificationText : value})
                }
                
            }.bind(this));
            
            Fingerpush.passPushData(value => {                                                       // 앱이 종료된 상태에서 푸시 클릭시 데이터를 받아오는 메소드
                this.setState({onNotificationText : value})
            })
        }
        else {    // iOS
            
            // iOS 리스너 등록
            FingerManagerEmitter.addListener('deviceToken',                                          // deviceToken 저장 리스너
                                             (token) =>
                                             {
                this.state.token = token['deviceToken']
                this.setDevice();
                
            }
                                             );
            
            FingerManagerEmitter.addListener('failToRegister',                                       // 토큰 등록 실패 에너 로그 리스너
                                             (error) => {
                console.log('failToRegisterError : ' + error)
                
            }
                                             );
            
            FingerManagerEmitter.addListener('notification', (value: Event) => {                     // 푸시 수신 클릭 리스너
                
                const data = JSON.parse(JSON.stringify(value))
                const src = data['src']
                
                if (src === 'fp') {                                                                  // 핑거푸시 여부 판단
                    console.log("src = " + src)
                    userinfo = value
                    this.setState({onNotificationText : JSON.stringify(value)})
                }
                
            });
            
            // 푸시 권한 요청
            FingerManager.requestPermissions({alert:true, badge:true, sound:true});
        }
    }
    
    // 핑거푸시에 기기 등록
    setDevice = () =>{
        if (Platform.OS === "android") {    //Android
            
            FingerManager.setDevice((posts) =>{
                this.setState({setDeviceResultText : posts})
            });
        }
        else {    //iOS
            FingerManager.setDevice(this.state.token, (posts) =>{
                this.setState({setDeviceResultText : posts})
            });
        }
    }
    
    // 푸시 읽음 처리
    checkPush = () =>{
        if (Platform.OS === "android") {
            FingerManager.checkPush(userinfo, (value) => {
                this.setState({onNotificationText : value})
            })
        }
        else {
            FingerManager.checkPush(userinfo, (value) => {
                this.setState({onNotificationText : value})
            })
        }
    }
    
    checkPushWithParameter = () =>{
        FingerManager.checkPushWithParameter(this.state.msgTag, this.state.mode, this.state.labelCode, (posts) =>{
            this.setState({checkPushText: posts})
        })
    }
    
    // 앱정보 확인
    getAppReport = () =>{
        FingerManager.getAppReport(value => {
            this.setState({getAppReportResultText : value})
        })
    }
    
    // 디바이스 정보 가져오기
    getDeviceInfo = () =>{
        FingerManager.getDeviceInfo(value => {
            this.setState({getDeviceInfoResultText : value})
        })
    }
    
    // 태그 값 설정하기
    setTag = () =>{
        FingerManager.setTag(this.state.tag, (value) =>{
            this.setState({setTagResultText: value})
        })
    }
    
    // 태그 불러오기
    getTag = () =>{
        FingerManager.getTag(value => {
            this.setState({getTagResultText: value})
        })
    }
    
    // 모든 태그 불러오기
    getAllTag = () =>{
        FingerManager.getAllTag(value => {
            this.setState({getAllTagResultText: value})
        })
    }
    
    // 식별자 설정하기
    setIdentity = () =>{
        FingerManager.setIdentity(this.state.identity, (posts) =>{
            this.setState({setIdentityResultText: posts})
        })
    }
    
    // 유니크 식별자 설정하기
    setUniqueIdentity = () =>{
        var isReceiveUniqueMessage = (this.state.isReceiveUniqueMessage == 'true')
        console.log(this.state.uniqueId + isReceiveUniqueMessage + this.state.uniqueMessage)
        FingerManager.setUniqueIdentity(this.state.uniqueId, isReceiveUniqueMessage, this.state.uniqueMessage, (posts) =>{
            this.setState({setUniqueIdentityResultText: posts})
        })
    }
    
    // 태그 지우기
    removeTag = () =>{
        FingerManager.removeTag(this.state.removeTag, (posts) =>{
            this.setState({removeTagResultText: posts})
        })
    }
    
    // 태그 전부 지우기
    removeAllTag = () =>{
        FingerManager.removeAllTag(value => {
            this.setState({removeAllTagResultText : value})
        })
    }
    
    // 식별자 지우기
    removeIdentity = () =>{
        FingerManager.removeIdentity(value => {
            this.setState({removeIdentityResultText : value})
        })
    }
    
    // 수신 여부 설정하기
    setPushAlive = () =>{
        var isAlive = (this.state.isAlive == 'true')
        FingerManager.setPushAlive(isAlive, (posts) =>{
            this.setState({setPushAliveResultText: posts})
        })
    }
    
    // 광고 수신 여부 설정하기
    setAdvertisePushEnable = () =>{
        var isAdAlive = (this.state.isAdAlive == 'true')
        FingerManager.setAdvertisePushEnable(isAdAlive, (posts) =>{
            this.setState({setAdvertisePushEnableResultText: posts})
        })
    }
    
    // 인앱푸시
    showInAppPush = () => {
        Fingerpush.showInAppPush((posts) => {
            this.setState({showInAppPushText: posts})
        })
    }
    
    render() {
        return (
                <View style={styles.container}>
                <ScrollView vertical={true}>
                <Text style={[styles.mainTitle]}>FingerPush Example</Text>
                
                <View style={styles.horizontal}>
                <View style={styles.title}>
                <Text>setDevice</Text>
                </View>
                
                <TouchableOpacity onPress={this.setDevice} style={styles.button}>
                <View style={styles.buttonText}>
                <Text>등록</Text>
                </View>
                </TouchableOpacity>
                </View>
                
                <View style={styles.message}>
                <Text>{this.state.setDeviceResultText}</Text>
                </View>
                
                <View style={styles.boundary} />
                
                <View style={styles.horizontal}>
                <View style={styles.title}>
                <Text>onNotification</Text>
                </View>
                
                <TouchableOpacity onPress={this.checkPush} style={styles.button}>
                <View style={styles.buttonText}>
                <Text>메세지 수신 확인</Text>
                </View>
                </TouchableOpacity>
                </View>
                
                <View style={styles.message}>
                <Text>{this.state.onNotificationText}</Text>
                </View>
                
                <View style={styles.boundary} />
                
                <View style={{marginTop:20, marginLeft: '5%', marginBottom: 10}}>
                <Text style>checkPushWithParameter</Text>
                </View>
                
                <TextInput style = {styles.inputText}
                placeholder = "msgTag"
                placeholderTextColor = "#999999"
                autoCapitalize = "none"
                onChangeText={msgTag => this.setState({msgTag})}/>
                
                <TextInput style = {styles.inputText}
                placeholder = "mode"
                placeholderTextColor = "#999999"
                autoCapitalize = "none"
                onChangeText={mode => this.setState({mode})}/>
                
                <TextInput style = {styles.inputText}
                placeholder = "labelCode"
                placeholderTextColor = "#999999"
                autoCapitalize = "none"
                onChangeText={labelCode => this.setState({labelCode})}/>
                
                <View style={styles.horizontal}>
                <TouchableOpacity onPress={this.checkPushWithParameter} style={styles.button}>
                <View style={styles.buttonText}>
                <Text>특정 푸시 읽음 처리</Text>
                </View>
                </TouchableOpacity>
                </View>
                
                <View style={styles.message}>
                <Text>{this.state.checkPushText}</Text>
                </View>
                
                <View style={styles.boundary} />
                
                <View style={styles.horizontal}>
                <View style={styles.title}>
                <Text>getAppReport</Text>
                </View>
                
                
                <TouchableOpacity onPress={this.getAppReport} style={styles.button}>
                <View style={styles.buttonText}>
                <Text>앱정보 확인</Text>
                </View>
                </TouchableOpacity>
                </View>
                
                <View style={styles.message}>
                <Text>{this.state.getAppReportResultText}</Text>
                </View>
                
                <View style={styles.boundary} />
                
                <View style={styles.horizontal}>
                <View style={styles.title}>
                <Text>getDeviceInfo</Text>
                </View>
                
                <TouchableOpacity onPress={this.getDeviceInfo} style={styles.button}>
                <View style={styles.buttonText}>
                <Text>디바이스 정보 가져오기</Text>
                </View>
                </TouchableOpacity>
                </View>
                
                <View style={styles.message}>
                <Text>{this.state.getDeviceInfoResultText}</Text>
                </View>
                
                <View style={styles.boundary} />
                
                <View style={styles.horizontal}>
                <View style={styles.title}>
                <Text>setTag</Text>
                </View>
                
                <TouchableOpacity onPress={this.setTag} style={styles.button}>
                <View style={styles.buttonText}>
                <Text>태그 값 설정하기</Text>
                </View>
                </TouchableOpacity>
                </View>
                
                <TextInput style = {styles.inputText}
                placeholder = "태그"
                placeholderTextColor = "#999999"
                onChangeText={tag => this.setState({tag})}/>
                
                <View style={styles.message}>
                <Text>{this.state.setTagResultText}</Text>
                </View>
                
                <View style={styles.boundary} />
                
                <View style={styles.horizontal}>
                <View style={styles.title}>
                <Text>getTag</Text>
                </View>
                
                <TouchableOpacity onPress={this.getTag} style={styles.button}>
                <View style={styles.buttonText}>
                <Text>태그 가져오기</Text>
                </View>
                </TouchableOpacity>
                </View>
                
                <View style={styles.message}>
                <Text>{this.state.getTagResultText}</Text>
                </View>
                
                <View style={styles.boundary} />
                
                <View style={styles.horizontal}>
                <View style={styles.title}>
                <Text>getAllTag</Text>
                </View>
                
                <TouchableOpacity onPress={this.getAllTag} style={styles.button}>
                <View style={styles.buttonText}>
                <Text>태그 가져오기</Text>
                </View>
                </TouchableOpacity>
                </View>
                
                <View style={styles.message}>
                <Text>{this.state.getAllTagResultText}</Text>
                </View>
                
                <View style={styles.boundary} />
                
                <View style={styles.horizontal}>
                <View style={styles.title}>
                <Text>setIdentity</Text>
                </View>
                
                <TouchableOpacity onPress={this.setIdentity} style={styles.button}>
                <View style={styles.buttonText}>
                <Text>식별자 설정하기</Text>
                </View>
                </TouchableOpacity>
                </View>
                
                <TextInput style = {styles.inputText}
                placeholder = "식별자"
                placeholderTextColor = "#999999"
                onChangeText={identity => this.setState({identity})}/>
                
                <View style={styles.message}>
                <Text>{this.state.setIdentityResultText}</Text>
                </View>
                
                <View style={styles.boundary} />
                
                <View style={{marginTop:20, marginLeft: '5%', marginBottom: 10}}>
                <Text style>setUniqueIdentity</Text>
                </View>
                
                <TextInput style = {styles.inputText}
                placeholder = "유니크 식별자"
                placeholderTextColor = "#999999"
                autoCapitalize = "none"
                onChangeText={uniqueId => this.setState({uniqueId})}/>
                
                <View style={{margin: '5%', marginBottom: 10}}>
                <Text style>기존 등록된 식별자에게 삭제 안내 발송 여부 (true or false)</Text>
                </View>
                
                <TextInput style = {styles.inputText}
                placeholder = "true/false"
                placeholderTextColor = "#999999"
                autoCapitalize = "none"
                onChangeText={isReceiveUniqueMessage => this.setState({isReceiveUniqueMessage})}/>
                
                <View style={{margin: '5%', marginBottom: 10}}>
                <Text style>기존 등록된 식별자에게 발송할 메시지 내용</Text>
                </View>
                
                <TextInput style = {styles.inputText}
                placeholder = "메세지 내용"
                placeholderTextColor = "#999999"
                autoCapitalize = "none"
                onChangeText={uniqueMessage => this.setState({uniqueMessage})}/>
                
                <View style={styles.horizontal}>
                <TouchableOpacity onPress={this.setUniqueIdentity} style={styles.button}>
                <View style={styles.buttonText}>
                <Text>식별자 설정하기</Text>
                </View>
                </TouchableOpacity>
                </View>
                
                <View style={styles.message}>
                <Text>{this.state.setUniqueIdentityResultText}</Text>
                </View>
                
                <View style={styles.boundary} />
                
                <View style={styles.horizontal}>
                <View style={styles.title}>
                <Text>removeTag</Text>
                </View>
                
                <TouchableOpacity onPress={this.removeTag} style={styles.button}>
                <View style={styles.buttonText}>
                <Text>태그 지우기</Text>
                </View>
                </TouchableOpacity>
                </View>
                
                <TextInput style = {styles.inputText}
                placeholder = "태그"
                placeholderTextColor = "#999999"
                onChangeText={removeTag => this.setState({removeTag})}/>
                <View style={styles.message}>
                <Text>{this.state.removeTagResultText}</Text>
                </View>
                
                <View style={styles.boundary} />
                
                <View style={styles.horizontal}>
                <View style={styles.title}>
                <Text>removeAllTag</Text>
                </View>
                
                <TouchableOpacity onPress={this.removeAllTag} style={styles.button}>
                <View style={styles.buttonText}>
                <Text>태그 전부 지우기</Text>
                </View>
                </TouchableOpacity>
                </View>
                
                <View style={styles.message}>
                <Text>{this.state.removeAllTagResultText}</Text>
                </View>
                
                <View style={styles.boundary} />
                
                <View style={styles.horizontal}>
                <View style={styles.title}>
                <Text>removeIdentity</Text>
                </View>
                
                <TouchableOpacity onPress={this.removeIdentity} style={styles.button}>
                <View style={styles.buttonText}>
                <Text>식별자 지우기</Text>
                </View>
                </TouchableOpacity>
                </View>
                
                <View style={styles.message}>
                <Text>{this.state.removeIdentityResultText}</Text>
                </View>
                
                <View style={styles.boundary} />
                
                <View style={styles.horizontal}>
                <View style={styles.title}>
                <Text>setPushAlive</Text>
                </View>
                
                <TouchableOpacity onPress={this.setPushAlive} style={styles.button}>
                <View style={styles.buttonText}>
                <Text>수신 여부 설정하기</Text>
                </View>
                </TouchableOpacity>
                
                </View>
                
                <TextInput style = {styles.inputText}
                placeholder = "true/false"
                placeholderTextColor = "#999999"
                autoCapitalize = "none"
                onChangeText={isAlive => this.setState({isAlive})}/>
                
                <View style={styles.message}>
                <Text>{this.state.setPushAliveResultText}</Text>
                </View>
                
                <View style={styles.boundary} />
                
                <View style={styles.horizontal}>
                <View style={styles.title}>
                <Text>setAdvertisePushEnable</Text>
                </View>
                
                <TouchableOpacity onPress={this.setAdvertisePushEnable} style={styles.button}>
                <View style={styles.buttonText}>
                <Text>광고 수신 여부 설정하기</Text>
                </View>
                </TouchableOpacity>
                </View>
                
                <TextInput style = {styles.inputText}
                placeholder = "true/false"
                placeholderTextColor = "#999999"
                autoCapitalize = "none"
                onChangeText={isAdAlive => this.setState({isAdAlive})}/>
                
                <View style={styles.message}>
                <Text>{this.state.setAdvertisePushEnableResultText}</Text>
                </View>
                
                <View style={styles.boundary} />
                
                <View style={styles.horizontal}>
                <View style={styles.title}>
                <Text>showInAppPush</Text>
                </View>
                
                <TouchableOpacity onPress={this.showInAppPush} style={styles.button}>
                <View style={styles.buttonText}>
                <Text>인앱푸시</Text>
                </View>
                </TouchableOpacity>
                </View>
                
                <View style={styles.message}>
                <Text>{this.state.showInAppPushText}</Text>
                </View>
                
                <View style={styles.boundary} />
                </ScrollView>
                </View>
                );
    }
}

const styles = StyleSheet.create({
mainTitle: {
marginTop: 60,
marginBottom: 10,
fontSize: 30,
textAlign: 'center'
},
    
container: {
flex: 1,
},
    
title: {
marginLeft: '5%',
alignItems: 'center',
justifyContent: 'center'
},
    
message: {
borderColor: '#3b5998',
borderWidth: 2,
padding:8,
marginLeft:'3%',
borderRadius:10,
marginRight:'5%'
},
    
button: {
margin: '3%',
borderRadius: 5,
padding:8
},
    
buttonText: {
borderColor: '#999999',
borderWidth: 1,
padding:8,
borderRadius:5,
},
    
inputText: {
borderWidth: 1,
marginLeft:'3%',
marginRight:'3%',
marginBottom:'5%',
borderRadius: 5,
padding:8,
marginRight: '40%',
},
    
horizontal: {
flexDirection:'row',
},
    
boundary: {
height:1,
backgroundColor:'black',
marginTop:'5%',
},
    
textAlign: {
textAlign: 'center'
}
});

export default App;
