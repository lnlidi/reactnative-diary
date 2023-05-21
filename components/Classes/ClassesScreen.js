import React, { useState, useEffect, useContext } from "react";
import { FlashList } from "@shopify/flash-list";
import { doc, addDoc, getDocs, getDoc, collection, query, where, disableNetwork, enableNetwork, orderBy } from 'firebase/firestore';
import { FIREBASE_DB } from 'config/firebase'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { TextInput, TouchableRipple, Button, IconButton, FAB, Portal } from 'react-native-paper';

import StylesContainers from '../style/containers'
import StylesButtons from '../style/buttons'
import StylesTexts from '../style/texts'
import StylesPaper from '../style/paper'

import Context from 'config/context';
import ClassesItem from "./ClassesItem";
import ModalEdit from '../Modals/ModalEdit'
import ModalDefault from '../Modals/ModalDefault'
import Loading from "../Modals/Loading";

import IconPlus from 'assets/svg/plus'


const ClassesScreen = ({ route, navigation }) => {
    const { contextSubject, updateContextSubject } = useContext(Context);
    const [loading, setLoading] = useState(false)
    const [modalMore, setModalMore] = useState(false)
    const [modalAdd, setModalAdd] = useState({show: false, isCreate: false})
    
    const [subjects, setSubjects] = useState([])
    const [className, setClassName] = useState('')
    const [classDescription, setClassDescription] = useState('')
    const [currentUser, setCurrentUser] = useState(null)
    
    useEffect(() => {
        refresh()
    }, [])

    useEffect(() => {
        if (Object.keys(contextSubject).length !== 0) {
            var data = [...subjects]
            let index = data.findIndex(v => v.subject.id === contextSubject.id)
            if (data[index].subject != contextSubject) {
                data[index].subject = contextSubject
                setSubjects(data)
            }
        }
    }, [contextSubject])

    useEffect(() => {
        if (route.params?.update) {
            refresh()
            updateContextSubject({})
        }
    }, [route.params])
    
    const refresh = async () => {
        setLoading(true)
        try {
            const email = await getUser()
            if (email === null) return alert('Login')
            await getSubjects(email)
        } catch (e) {
            alert(e);
        }
        setLoading(false)
    }

    const getUser = async () => {
        let item = await AsyncStorage.getItem('currentUser')
        if (item !== null) {
            let value = JSON.parse(item)
            setCurrentUser(value)
            return value.email
        }
        return null
    }
    
    const getSubjects = async (email) => {
        const querySnapshot = await getDocs(query(
            collection(FIREBASE_DB, 'members'),
            where('userId', '==', email)
        ));

        const subjectIds = [];
        const subjectData = [];

        querySnapshot.forEach(doc => {
            subjectIds.push({id: doc.data().subjectId, role: doc.data().role});
        });

        await Promise.all(subjectIds.map(async (subjectId) => {
            const subjectDocSnap = await getDoc(doc(FIREBASE_DB, 'subjects', subjectId.id));
            const userDocSnap = await getDoc(doc(FIREBASE_DB, 'users', subjectDocSnap.data().createdBy));
            var subjectDocData = Object.assign(subjectDocSnap.data(), {id: subjectDocSnap.id, role: subjectId.role})
            var userDocData = userDocSnap.data()
            subjectData.push({subject: subjectDocData, user: userDocData});
        }));

        setSubjects(subjectData);
    }

    const createClass = async () => {
        if (className.length === 0) return alert('Введите название класса!')
        setLoading(true)
        try {
            if (modalAdd.isCreate) {
                let currentDate = new Date();
                const subjectRef = await addDoc(
                    collection(FIREBASE_DB, 'subjects'), {
                        name: className,
                        description: null,
                        createdBy: currentUser.email,
                        createdAt: currentDate,
                        canJoin: true
                    }
                );
                await addDoc(
                    collection(FIREBASE_DB, 'members'), {
                        subjectId: subjectRef.id,
                        userId: currentUser.email,
                        role: 'admin',
                        joined: currentDate
                    }
                );
            } else {
                const subjectDocSnapshot = await getDoc(doc(FIREBASE_DB, 'subjects', className))

                if (!subjectDocSnapshot.exists()) throw Error('Класс с таким кодом не найдено')
                else {
                    if (!subjectDocSnapshot.data().canJoin) throw Error('Класс с таким кодом не найдено')
                    const membersCollectionRef = collection(FIREBASE_DB, 'members');
                    const q = query(
                        membersCollectionRef,
                        where('subjectId', '==', className),
                        where('userId', '==', currentUser.email)
                    );
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) throw Error('Вы уже были записаны на этот класс')
                    else {
                        await addDoc(membersCollectionRef, {
                            subjectId: className,
                            userId: currentUser.email,
                            role: 'pupil',
                            joined: new Date()
                        });
                    }
                }
            }
            setModalAdd({show: false, isCreate: false})
        } catch (e) {
            setLoading(false)
            return alert(e);
        }
        refresh()
        setClassName('')
    }


    return (
        <View style={{flex: 1}}>
            <Loading loading={loading}/>
            <FAB icon={IconPlus}
                size='medium'
                color='black'
                style={[StylesButtons.active, StylesButtons.buttonFloat]}
                onPress={() => setModalMore(true)}
            />
            <ModalDefault modal={modalMore} hideModal={() => setModalMore(false)}
                content={
                    <>
                        <TouchableOpacity activeOpacity={0.5} style={StylesContainers.modalButton}
                            onPress={() => {setModalMore(false); setModalAdd({show: true, isCreate: true})}}
                        >
                            <Text style={StylesTexts.default}> Создать </Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.5} style={StylesContainers.modalButton}
                            onPress={() => {setModalMore(false); setModalAdd({show: true, isCreate: false})}}
                        >
                            <Text style={StylesTexts.default}> Присоединиться </Text>
                        </TouchableOpacity>
                    </>
                }
            />
            <ModalDefault modal={modalAdd.show} hideModal={() => setModalAdd({show: false, isCreate: false})}
                content={
                    <View style={{gap: 15}}>
                        <TextInput mode="outlined"
                            inputMode="text"
                            label={modalAdd.isCreate ? "Название класса" : "Код класса"}
                            value={className}
                            onChangeText={(v) => setClassName(v)}
                            maxLength={50}
                            style={[StylesTexts.default, {margin: 15}]}
                            theme={StylesPaper.input}
                            selectionColor={StylesButtons.activeBack.backgroundColor}
                            right={!modalAdd.isCreate ? null : <TextInput.Affix text={`${className.length}/50`}/>}
                        />
                        <TouchableRipple onPress={createClass}
                            style={{alignItems: 'center', padding: 15, backgroundColor: StylesButtons.active.backgroundColor}}
                        >
                            <Text style={[StylesTexts.header]}> {modalAdd.isCreate ? 'Создать' : 'Присоединиться'} </Text>
                        </TouchableRipple>
                    </View>
                }
            />

            <Button mode='contained' style={{width: 200, marginTop: 10, alignSelf: 'center'}} onPress={() => disableNetwork(FIREBASE_DB)}>disableNetwork</Button>
            <Button mode='contained' style={{width: 200, marginTop: 10, alignSelf: 'center'}} onPress={() => enableNetwork(FIREBASE_DB)}>enableNetwork</Button>
            
            <FlashList
                data={subjects}
                keyExtractor={(item) => item.subject.id}
                estimatedItemSize={130}
                contentContainerStyle={StylesContainers.screen}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
                ListEmptyComponent={() => (
                    <View style={StylesContainers.default}>
                        <Text style={[StylesTexts.default, StylesContainers.alert, {padding: 40}]}> Нет записей </Text>
                    </View>
                )}
                renderItem={
                    ({item}) => (
                        <TouchableOpacity activeOpacity={0.5}
                            onPress={() => {
                                updateContextSubject(item.subject);
                                navigation.navigate('ClassScreen');
                            }}
                            style={StylesContainers.flashListItemContainer}
                        >
                            <ClassesItem item={item}/>
                        </TouchableOpacity>
                    )
                }
            />
        </View>
    );
};

export default ClassesScreen;