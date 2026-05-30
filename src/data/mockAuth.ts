import { useState } from 'react'
import type { UserProfile as UserProfileType } from '../types'

export type UserProfile = UserProfileType

// Mock 认证状态
let mockIsLoggedIn = false
let mockHasCompletedOnboarding = false
let mockUserProfile: UserProfile = {
  grade: '',
  textbookVersion: '',
  examGoal: ''
}

// 获取登录状态
export const getIsLoggedIn = () => mockIsLoggedIn

// 获取是否完成新手引导
export const getHasCompletedOnboarding = () => mockHasCompletedOnboarding

// 获取用户资料
export const getUserProfile = () => mockUserProfile

// 设置登录状态
export const setIsLoggedIn = (value: boolean) => {
  mockIsLoggedIn = value
}

// 设置是否完成新手引导
export const setHasCompletedOnboarding = (value: boolean) => {
  mockHasCompletedOnboarding = value
}

// 设置用户资料
export const setUserProfile = (profile: UserProfile) => {
  mockUserProfile = profile
}

// 登录
export const login = () => {
  setIsLoggedIn(true)
}

// 登出
export const logout = () => {
  setIsLoggedIn(false)
  setHasCompletedOnboarding(false)
  setUserProfile({
    grade: '',
    textbookVersion: '',
    examGoal: ''
  })
}

// 完成新手引导
export const completeOnboarding = (profile: UserProfile) => {
  setUserProfile(profile)
  setHasCompletedOnboarding(true)
}

// React Hook 版本，供组件使用
export const useAuth = () => {
  const [isLoggedIn, setIsLoggedInState] = useState(mockIsLoggedIn)
  const [hasCompletedOnboarding, setHasCompletedOnboardingState] = useState(mockHasCompletedOnboarding)
  const [userProfile, setUserProfileState] = useState(mockUserProfile)

  // 同步状态变化
  const updateState = () => {
    setIsLoggedInState(mockIsLoggedIn)
    setHasCompletedOnboardingState(mockHasCompletedOnboarding)
    setUserProfileState({ ...mockUserProfile })
  }

  const loginWithUpdate = () => {
    login()
    updateState()
  }

  const logoutWithUpdate = () => {
    logout()
    updateState()
  }

  const completeOnboardingWithUpdate = (profile: UserProfile) => {
    completeOnboarding(profile)
    updateState()
  }

  return {
    isLoggedIn,
    hasCompletedOnboarding,
    userProfile,
    login: loginWithUpdate,
    logout: logoutWithUpdate,
    completeOnboarding: completeOnboardingWithUpdate
  }
}
