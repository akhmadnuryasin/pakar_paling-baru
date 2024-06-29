import { Tabs, TabsContent } from '@/components/ui/tabs';
import ThemeSwitch from '@/components/theme-switch';
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout';
import { Breadcrumb, BreadcrumbItem } from '@/components/custom/breadcrumb';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth-context';
import { IconLogout2 } from '@tabler/icons-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Akun = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear user key from localStorage
    localStorage.removeItem('user');
    // Redirect to /sign-in
    navigate('/sign-in');
  };
  const { user } = useAuth();

  const items = [
    { title: 'Dashboard', href: '/' },
    { title: 'Account' },
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
            <Separator className="my-4" />
            <div className="mt-auto">
              <Card x-chunk="dashboard-02-chunk-0">
                <CardHeader className="p-2 pt-0 md:p-4">
                  <CardTitle className='pt-2'>Email</CardTitle>
                  <CardDescription>
                    {user ? user.email : 'Loading...'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                  <Button onClick={handleLogout} size="sm" className="w-full space-x-2">
                    <IconLogout2 size={18} />
                    <span>Logout</span>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </LayoutBody>
    </Layout>
  );
};

export default Akun;
