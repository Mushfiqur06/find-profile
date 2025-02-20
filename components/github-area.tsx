import { Divider, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { UseAppDispatch, UseAppSelector } from '../store';
import { getGithubUserInfo, setGithubUserInfo, setGithubUsername } from '../store/platforms/github';
import { setEmail } from '../store/user/basicInfo';
import { SearchByType } from '../types/common.types';
import { getGithubInfoByName, getRepoList } from '../Utils/github';
import CardGithub from './common/card';

const githubApi = {
  name: 'github',
  userInfoApi: 'https://api.github.com/users/userName',
  repoListApi: 'https://api.github.com/users/userName/repos',
}

const GithubArea = (props: any) => {
  const { hostname = '', pathname = '', searchBy, originalSearchVal } = props;

  const githubUserInfo = UseAppSelector(getGithubUserInfo);
  const { username } = githubUserInfo
  const dispatch = UseAppDispatch();

  useEffect(() => {
    if (username) return
    let githubUserName = originalSearchVal
    if (searchBy === SearchByType.URL) {
      if (!hostname || !pathname) return;
      githubUserName = pathname.split('/').pop();
    }
    dispatch(setGithubUsername(githubUserName))

  }, [originalSearchVal]);

  useEffect(() => {
    if (!username) return

    getGithubData(username)
  }, [username]);


  const getGithubData = React.useCallback(async (name: string) => {
    if (window == undefined) return;
    const getRepoListApi = githubApi.repoListApi.replace('userName', name);
    const userProfileApi = githubApi.userInfoApi.replace('userName', name);

    const [gitHubBasicInfo, githubRepos] = await Promise.all([
      getGithubInfoByName(userProfileApi),
      getRepoList(getRepoListApi),
    ]);
    const { email } = gitHubBasicInfo;
    if (email) dispatch(setEmail(email))
    dispatch(setGithubUserInfo({ ...gitHubBasicInfo, topRepos: githubRepos, username: name }))
  }, []);




  return <>


    {(githubUserInfo.topRepos || [])?.length > 0 && (
      <>
        <Typography variant='h5' component='div'> Projects  </Typography>

        <Divider sx={{ mb: 5 }} />

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {githubUserInfo.topRepos?.map((repo, idx) => (
            <CardGithub topRepo={repo} key={'repo' + idx} />
          ))}
        </div>
      </>
    )}</>
}
export default GithubArea