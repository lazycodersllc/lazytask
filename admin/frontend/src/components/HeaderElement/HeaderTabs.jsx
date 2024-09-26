import cx from 'clsx'; 
import { Link, useLocation } from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import {IconCalendarEvent, IconHome, IconPaperclip, IconTemplate, IconClipboardCopy} from '@tabler/icons-react';

import {
    Container,
    Avatar,
    UnstyledButton,
    Group,
    Text,
    Menu,
    Burger,
    rem,
    Button,
    useMantineTheme,
    Drawer, Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconLogout, 
  IconEdit, 
  IconSettings, 
  IconChevronDown, 

} from '@tabler/icons-react'; 
import '@mantinex/mantine-logo/styles.css';
import classes from './HeaderTabs.module.css';  
import WorkspaceLists from '../Elements/Workspace/WorkspaceLists';
import {useSelector} from "react-redux";
import useAuth from "../../utils/useAuth";
import {hasPermission} from "../ui/permissions";

const dashboardMainMenuData = [
    {
      label: 'Dashboard',
      url: '#/dashboard',
      icon: (<IconHome stroke={1.25} size={24} color={`#202020`} /> ),
    },
    {
      label: 'My Zen',
      url: '',
      icon: (<IconCalendarEvent stroke={1.25} size={24} color={`#202020`} /> )
    },
    {
      label: 'My Task',
      url: '#/my-task',
      icon: (<IconClipboardCopy stroke={1.25} size={24} color={`#202020`} /> ),
    },
  ];

  const DashboardMenu = ({ label, url, icon }) => (
    <a href={url} key={label} className="flex items-center">
      <div className='mr-1'>{icon}</div>
      <span>{label}</span>
    </a>
  );

export function HeaderTabs() {
  const theme = useMantineTheme();
  // const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const { loggedInUser } = useSelector((state) => state.auth.session)

  const [isVisible, setIsVisible] = useState(false);
  const handleProjectCreateSlide = () => {
      setIsVisible(!isVisible);
    };
    const {loggedUserId} = useSelector((state) => state.auth.user)
    const icon = <IconPaperclip style={{ width: rem(18), height: rem(18) }} stroke={1.5} />;
    const [opened, { open, close, toggle }] = useDisclosure(false);
    const { signOut } = useAuth();
    let location = useLocation();
//for premium
    document.addEventListener('DOMContentLoaded', function () {
                if (window.lazytaskPremium) {
                    window.lazytaskPremium.mobileAppQRCode();
                }
            }
        );
    useEffect(() => {
        if (window.lazytaskPremium) {
            window.lazytaskPremium.mobileAppQRCode();
        }
    }, [location]);

  return (
    <div className={`relative ${classes.header}`}>
     

      <Container className="py-1" size="full">
        <Group justify="space-between">
            {/* <MantineLogo size={28} /> */} 
            <div className='flex space-x-4'>
              {dashboardMainMenuData.map((menuItem) => (
                <DashboardMenu {...menuItem} />
              ))}
            </div> 

                  <div className='flex items-center gap-4'>
                      {/* <ButtonMenu /> */}
                      <div id="lazytask_premium_mobile_app_qr_code">
                          {/*for preminum*/}

                      </div>
                      <Button className={`font-semibold`} onClick={open} variant="filled"
                              color="#ED7D31">Workspace</Button>

                      <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm"/>
                      <Menu
                          width={260}
                          position="bottom-end"
                          transitionProps={{transition: 'pop-top-right'}}
                          onClose={() => setUserMenuOpened(false)}
                          onOpen={() => setUserMenuOpened(true)}
                          withinPortal
                      >
                          <Menu.Target>
                              <UnstyledButton
                                  className={cx(classes.user, {[classes.userActive]: userMenuOpened})}
                              >
                                  <Group gap={7}>
                                      <Avatar src={loggedInUser?.avatar} alt={loggedInUser?.name} radius="xl"
                                              size={32}/>
                                      <Text fw={500} size="sm" lh={1} mr={3}>
                                          {loggedInUser ? loggedInUser.name : ''}
                                      </Text>
                                      <IconChevronDown style={{width: rem(12), height: rem(12)}} stroke={1.5}/>
                                  </Group>
                              </UnstyledButton>
                          </Menu.Target>
                          <Menu.Dropdown>

                              <Link to={`/profile/${loggedInUser ? loggedInUser.loggedUserId : loggedUserId}`}>
                                  <Menu.Item
                                      leftSection={
                                          <IconEdit
                                              style={{width: rem(16), height: rem(16)}}
                                              color={theme.colors.yellow[6]}
                                              stroke={1.5}
                                          />
                                      }
                                  >
                                      Profile
                                  </Menu.Item>
                              </Link>

                              {hasPermission(loggedInUser && loggedInUser.llc_permissions, ['superadmin', 'admin', 'director', 'notification-template']) &&
                                  <Link to="/settings">
                                      <Menu.Item
                                          leftSection={
                                              <IconSettings style={{width: rem(16), height: rem(16)}} stroke={1.5}/>
                                          }
                                      >
                                          Settings
                                      </Menu.Item>
                                  </Link>
                              }


                              <Menu.Item
                                  onClick={signOut}
                                  leftSection={
                                      <IconLogout style={{width: rem(16), height: rem(16)}} stroke={1.5}/>
                                  }
                              >
                                  Logout
                              </Menu.Item>

                          </Menu.Dropdown>
                      </Menu>
                  </div>
              </Group>
          </Container>


          <div className="drawer mt-[16]">
              <Drawer opened={opened} onClose={close}
                      position="right"
                      withCloseButton={false}
                      size="md"
                      overlayProps={{backgroundOpacity: 0, blur: 0}}
              >
                  <Drawer.Body>

                      <div className='workspace-create-card'>
                          <div className="relative flex justify-between mb-4">
                              <Title order={4}>
                                  Workspace
                              </Title>
                              <Drawer.CloseButton/>
                          </div>
                          <WorkspaceLists/>
                      </div>
                  </Drawer.Body>

              </Drawer>
          </div>

    </div>
  );
}