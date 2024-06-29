import  { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import ThemeSwitch from '@/components/theme-switch';
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout';
import { Breadcrumb, BreadcrumbItem } from '@/components/custom/breadcrumb';
import { Link } from 'react-router-dom';
import {
  IconVirusSearch,
  IconUsersGroup,
  IconScale,
  IconAbacus,
  IconCarCrash,
  IconRulerMeasure
} from '@tabler/icons-react';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    gejala: { name: 'Gejala', icon: 'IconVirusSearch', count: 0 },
    kerusakan: { name: 'Kerusakan', icon: 'IconCarCrash', count: 0 },
    probabilitas: { name: 'Probabilitas', icon: 'IconAbacus', count: 0 },
    basis_pengetahuan: { name: 'Bobot Gejala', icon: 'IconScale', count: 0 },
    rule_aturan: { name: 'Rule', icon: 'IconRulerMeasure', count: 0 },
    users: { name: 'Pengguna', icon: 'IconUsersGroup', count: 0 }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://sistempakar-backendapp-ce3dc310e112.herokuapp.com/admin/dashboard'); 
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setDashboardData(prevDashboardData => ({
        ...prevDashboardData,
        gejala: { ...prevDashboardData.gejala, count: data.gejala.count },
        kerusakan: { ...prevDashboardData.kerusakan, count: data.kerusakan.count },
        probabilitas: { ...prevDashboardData.probabilitas, count: data.probabilitas.count },
        basis_pengetahuan: { ...prevDashboardData.basis_pengetahuan, count: data.basis_pengetahuan.count },
        rule_aturan: { ...prevDashboardData.rule_aturan, count: data.rule_aturan.count },
        users: { ...prevDashboardData.users, count: data.users.count }
      }));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };
  

  const items = [
    { title: 'Dashboard', href: '/' },
    // Tambahkan breadcrumb items sesuai kebutuhan
  ].map(({ href, title }, index) => (
    <BreadcrumbItem key={index}>
      {href ? (
        <Link
          className='font-medium text-muted-foreground decoration-muted-foreground decoration-dashed underline-offset-4 hover:text-foreground hover:decoration-solid'
          to={href}
        >
          {title}
        </Link>
      ) : (
        <span className='font-medium text-muted-foreground'>{title}</span>
      )}
    </BreadcrumbItem>
  ));

  return (
    <Layout>
      {/* Top Heading */}
      <LayoutHeader>
        <div className='flex items-center justify-between w-full pl-2 space-x-4 lg:p-b- lg:ml-auto'>
          <Breadcrumb>{items}</Breadcrumb>
          <ThemeSwitch />
        </div>
      </LayoutHeader>

      {/* Main Content */}
      <LayoutBody className='pt-0 space-y-4'>
        <Tabs orientation='vertical' defaultValue='overview' className='space-y-4'>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              {/* <Card className='col-span-1 lg:col-span-8'>
                <CardHeader>
                  <CardTitle>Selamat Datang Di Sistem Pakar Admin</CardTitle>
                </CardHeader>
              </Card> */}
            </div>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {/* Gejala */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                  <CardTitle className='text-sm font-medium'>
                    {dashboardData.gejala.name}
                  </CardTitle>
                  <IconVirusSearch className='w-4 h-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {dashboardData.gejala.count}
                  </div>
                </CardContent>
              </Card>

              {/* Materi Kerusakan */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                  <CardTitle className='text-sm font-medium'>
                    {dashboardData.kerusakan.name}
                  </CardTitle>
                  <IconCarCrash className='w-4 h-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {dashboardData.kerusakan.count}
                  </div>
                </CardContent>
              </Card>

              {/* Probabilitas Card */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                  <CardTitle className='text-sm font-medium'>
                    {dashboardData.probabilitas.name}
                  </CardTitle>
                  <IconAbacus className='w-4 h-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {dashboardData.probabilitas.count}
                  </div>
                </CardContent>
              </Card>

              {/* Bobot Card */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                  <CardTitle className='text-sm font-medium'>
                    {dashboardData.basis_pengetahuan.name}
                  </CardTitle>
                  <IconScale className='w-4 h-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {dashboardData.basis_pengetahuan.count}
                  </div>
                </CardContent>
              </Card>

              {/* Rule Card */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                  <CardTitle className='text-sm font-medium'>
                    {dashboardData.rule_aturan.name}
                  </CardTitle>
                  <IconRulerMeasure className='w-4 h-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {dashboardData.rule_aturan.count}
                  </div>
                </CardContent>
              </Card>

              {/* Pengguna Card */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                  <CardTitle className='text-sm font-medium'>
                    {dashboardData.users.name}
                  </CardTitle>
                  <IconUsersGroup className='w-4 h-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {dashboardData.users.count}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </LayoutBody>
    </Layout>
  );
};

export default Dashboard;
