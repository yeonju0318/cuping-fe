import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRecoilState } from 'recoil';
import useInput from '../../../hooks/useInput';
import OwnerSignup from '../OwnerSignup/OwnerSignup';
import errorIcon from '../../../assets/img/warning.svg';
import cupingLogo from '../../../assets/img/cupping-logo-icon02.svg';
import bini from '../../../assets/img/beni.svg';
import checkIcon from '../../../assets/img/check.svg';
import {
  CheckUserIdService,
  SignupUserService,
} from '../../../apis/services/SignupService/SignupService';
import styles from './UserSignup.module.css';
import { loginState } from '../../../recoil/atom/loginState';

const UserSignup = () => {
  const navigate = useNavigate();
  const [userId, idRef, handleChangeUserId] = useInput();
  const [nickname, nicknameRef, handleChangeNickname] = useInput();
  const [password, PasswordRef, handleChangePassword] = useInput();
  const [passwordCheck, PasswordCheckRef, handleChangePasswordCheck] =
    useInput();
  const [passwordCheckMsg, setPasswordCheckMsg] = useState('');

  // 로그인이 되었는지 확인
  const [loggedin, setLoggedin] = useRecoilState(loginState);

  // 로그인이 되어있다면 메인 페이지로 라우팅
  useEffect(() => {
    const checkLoginStatus = () => {
      const accessToken = Cookies.get('ACCESS_KEY');
      if (accessToken) {
        navigate('/');
        alert('이미 로그인 되어있습니다. 로그 아웃 후 이용해주세요.');
      } else {
        setLoggedin(false);
      }
    };

    checkLoginStatus();
  }, []);

  // 비밀번호 일치 검사
  useEffect(() => {
    if (!passwordCheck) {
      setPasswordCheckMsg('비밀번호를 입력해주세요.');
    } else if (!!passwordCheck && passwordCheck !== password) {
      setPasswordCheckMsg('비밀번호가 일치하지 않습니다.');
    } else {
      setPasswordCheckMsg('비밀번호가 일치합니다.');
    }
  }, [password, passwordCheck]);

  // 아이디 중복 검사
  const { mutate: CheckUserMutate } = CheckUserIdService();
  const idCheckBtnClick = () => {
    if (!userId) {
      alert('아이디를 입력하세요.');
      return;
    }
    CheckUserMutate({ userId });
  };

  // 회원가입 버튼 클릭 & 유효성 검사
  const { mutate: SignupUserMutate } = SignupUserService();
  const signupBtnClick = (e: any) => {
    e.preventDefault();
    const nicknameRegex = /^[a-zA-Z가-힣]{2,8}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*\d)(?=.*[~!?_@#$%^&*()+|=])[a-z\d~!?_@#$%^&*()+|=]{8,12}$/;

    if (!nickname || !password || !userId) {
      alert('아이디,닉네임과 비밀번호를 모두 입력하세요.');
      return;
    }

    if (!nicknameRegex.test(nickname)) {
      alert('닉네임은 최소 2~8자, 알파벳 소문자 및 한글 닉네임이어야 합니다.');
      return;
    }

    if (!passwordRegex.test(password)) {
      alert(
        '비밀번호는 최소 8~12자, 알파벳 소문자와 숫자와 특수문자로 구성되어야 합니다.',
      );
      return;
    }

    if (password !== passwordCheck) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    SignupUserMutate({
      userId,
      nickname,
      password,
    });
  };

  // 일반/사장 가입 스위칭
  const [active, setActive] = useState(false);

  const handleButtonClick = (isOwnerForm: any) => {
    if ((isOwnerForm && !active) || (!isOwnerForm && active)) {
      setActive(!active);
    }
  };

  return (
    <div className={`${styles.mainContainer}`}>
      <div className="w-[1440px] flex justify-center">
        <div className="left flex h-full items-center mt-[5rem] mr-[3rem]">
          <div className="flex flex-col">
            <img
              src={cupingLogo}
              alt="Logo"
              className="w-[10rem] cursor-pointer mb-10"
              onClick={() => navigate('/')}
              role="presentation"
            />
            <div className="mb-20">
              <div className="text-[24px] text-[#CEAC8A] mb-2">
                <div>지금 여기,</div>
                <div>맛있는 원두를 찾고 싶을 땐</div>
                <div>커핑 하세요!</div>
              </div>
              <div>원두 기반 카페 검색 서비스</div>
            </div>
            <img src={bini} alt="charac" className="w-full" />
          </div>
        </div>
        <div className="right">
          <div className="p-10 xs:p-0 mx-auto md:w-full w-full flex justify-center items-center h-full">
            <div className="bg-white divide-y divide-gray-200 border-4 border-primary-color-salgu w-[428px]">
              <div className="m-[39px]">
                <div className="member w-[350px] grid grid-cols-2 gap-1 bg-gray-200 rounded-lg px-0.5 py-1 my-[44px]">
                  <button
                    type="button"
                    onClick={() => handleButtonClick(false)}
                    className={`transition duration-200 border bg-gray-200
                  border-gray-200 text-gray-500 py-0.5 rounded-lg
                  text-sm hover:shadow-sm mx-0.5
                  ${
                    !active ? 'bg-white text-orange-400 font-semibold' : ''
                  } font-normal text-center inline-block`}
                  >
                    일반 회원 등록
                  </button>
                  <button
                    type="button"
                    // onClick={() => handleButtonClick(true)}
                    onClick={() => {
                      alert('피드백을 받아 수정입니다.');
                    }}
                    className={`transition duration-200 border bg-gray-200
                  border-gray-200 text-gray-500 py-0.5 rounded-lg
                  text-sm hover:shadow-sm mx-0.5
                  ${
                    active ? 'bg-white text-orange-400 font-semibold' : ''
                  } font-normal text-center inline-block`}
                  >
                    사장님 회원 등록
                  </button>
                </div>
                {active ? (
                  <OwnerSignup
                    userId={userId}
                    handleChangeUserId={handleChangeUserId}
                    nickname={nickname}
                    handleChangeNickname={handleChangeNickname}
                    password={password}
                    handleChangePassword={handleChangePassword}
                    passwordCheck={passwordCheck}
                    handleChangePasswordCheck={handleChangePasswordCheck}
                    passwordCheckError={passwordCheckMsg}
                  />
                ) : (
                  <div className="w-[350px]">
                    <label
                      htmlFor="idInput"
                      className="text-sm text-gray-600 pb-1 block"
                    >
                      <div className="font-semibold mb-1">아이디</div>
                      <div className="flex items-center gap-2">
                        <input
                          value={userId}
                          onChange={handleChangeUserId}
                          ref={idRef}
                          id="idInput"
                          type="text"
                          placeholder="아이디 입력(5~12자)"
                          className="border rounded-lg px-3 py-2 mt-1 mb-1 text-sm w-full"
                        />
                        <button
                          type="button"
                          onClick={idCheckBtnClick}
                          className="transition duration-200 bg-primary-color-salgu hover:bg-primary-color-orange text-white w-[10rem] py-2 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
                        >
                          <span className="inline-block">중복확인</span>
                        </button>
                      </div>
                    </label>
                    <label
                      htmlFor="nkInput"
                      className="text-sm text-gray-600 pb-1 block"
                    >
                      <div className="font-semibold mb-1">닉네임</div>
                      <input
                        value={nickname}
                        onChange={handleChangeNickname}
                        ref={nicknameRef}
                        id="nkInput"
                        type="text"
                        placeholder="닉네임은 2~8자, 알파벳 소문자 및 한글"
                        className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                      />
                    </label>

                    <label
                      htmlFor="pwInput"
                      className="text-sm text-gray-600 pb-1 block"
                    >
                      <div className="font-semibold mb-1">비밀번호</div>
                      <input
                        value={password}
                        onChange={handleChangePassword}
                        ref={PasswordRef}
                        id="pwInput"
                        type="password"
                        placeholder="알파벳 소문자와 숫자와 특수문자 8~16자"
                        className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                      />
                    </label>
                    <div className="relative flex flex-col">
                      <label
                        htmlFor="pwCheckInput"
                        className="text-sm text-gray-600 pb-1 block"
                      >
                        <div>
                          <div className="font-semibold mb-1">
                            비밀번호 확인
                          </div>
                          <input
                            value={passwordCheck}
                            onChange={handleChangePasswordCheck}
                            ref={PasswordCheckRef}
                            id="pwCheckInput"
                            type="password"
                            placeholder="비밀번호를 다시 입력하세요."
                            className={`ring-1 border rounded-lg px-3 py-2 mt-1 mb-2 text-sm w-full ${
                              passwordCheckMsg === '비밀번호가 일치합니다.'
                                ? styles.successRing
                                : styles.errorRing
                            }`}
                          />
                        </div>
                      </label>
                      <div className="flex items-center justify-between">
                        <div
                          className={`text-xs ${
                            passwordCheckMsg === '비밀번호가 일치합니다.'
                              ? styles.successMsg
                              : styles.errorMsg
                          }`}
                        >
                          {passwordCheckMsg}
                        </div>
                        <img
                          src={
                            passwordCheckMsg === '비밀번호가 일치합니다.'
                              ? checkIcon
                              : errorIcon
                          }
                          alt=""
                          className="w-[18px] flex items-center"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      onClick={signupBtnClick}
                      className="transition duration-200 bg-primary-color-salgu hover:bg-primary-color-orange text-white w-full py-2.5 mt-2 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
                    >
                      <span className="inline-block mr-2">회원가입 하기</span>
                    </button>
                    <div className="border-t border-gray-200 my-5 mt-10" />
                    <button
                      type="button"
                      className="transition duration-200 bg-yellow-400 hover:bg-yellow-600 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
                      onClick={() => {
                        alert('준비중입니다.');
                      }}
                    >
                      카카오톡 간편 가입하기
                    </button>
                    <div className="mt-10 text-center">
                      <span className="font-semibold text-sm">
                        이미 커핑 회원이세요?
                      </span>
                      <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="font-semibold text-sm ml-2 text-primary-color-orange
                    tracking-tighter"
                      >
                        로그인 하러 가기
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
