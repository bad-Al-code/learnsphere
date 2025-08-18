import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, Paperclip, Search } from 'lucide-react';

const MessageListSidebar = () => {
  const messages = [
    {
      id: 1,
      sender: 'Sarah Chen',
      subject: 'Question about Assignment 3',
      preview: "Hi Professor, I'm having trouble with the...",
      course: 'Data Science',
      time: '2 hours ago',
      priority: 'normal',
      hasAttachment: true,
      avatar: '/api/placeholder/32/32',
      isUnread: true,
    },
    {
      id: 2,
      sender: 'Michael Rodriguez',
      subject: 'Request for Extension',
      preview: 'Dear Professor, I would like to request a...',
      course: 'Web Development',
      time: '5 hours ago',
      priority: 'high',
      hasAttachment: false,
      avatar: '/api/placeholder/32/32',
      isUnread: false,
    },
    {
      id: 3,
      sender: 'Emma Thompson',
      subject: 'Thank you for the feedback',
      preview: 'Thank you so much for the detailed feed...',
      course: 'Digital Marketing',
      time: '1 day ago',
      priority: 'normal',
      hasAttachment: false,
      avatar: '/api/placeholder/32/32',
      isUnread: false,
    },
    {
      id: 4,
      sender: 'David Kim',
      subject: 'Course Material Access Issue',
      preview: "I'm unable to access the video lectures f...",
      course: 'Graphic Design',
      time: '2 days ago',
      priority: 'high',
      hasAttachment: false,
      avatar: '/api/placeholder/32/32',
      isUnread: false,
    },
    {
      id: 5,
      sender: 'Lisa Wang',
      subject: 'Lab Report Submission',
      preview: "I've completed the lab report and wanted to...",
      course: 'Computer Science',
      time: '3 days ago',
      priority: 'normal',
      hasAttachment: true,
      avatar: '/api/placeholder/32/32',
      isUnread: true,
    },
    {
      id: 6,
      sender: 'James Miller',
      subject: 'Group Project Coordination',
      preview: 'Our team needs to discuss the project timeline...',
      course: 'Business Management',
      time: '4 days ago',
      priority: 'high',
      hasAttachment: false,
      avatar: '/api/placeholder/32/32',
      isUnread: false,
    },
    {
      id: 7,
      sender: 'Anna Garcia',
      subject: 'Office Hours Availability',
      preview: 'Are you available for office hours this week...',
      course: 'Mathematics',
      time: '5 days ago',
      priority: 'normal',
      hasAttachment: false,
      avatar: '/api/placeholder/32/32',
      isUnread: false,
    },
    {
      id: 8,
      sender: 'Robert Johnson',
      subject: 'Research Paper Guidelines',
      preview: 'Could you clarify the formatting requirements...',
      course: 'Psychology',
      time: '1 week ago',
      priority: 'normal',
      hasAttachment: true,
      avatar: '/api/placeholder/32/32',
      isUnread: false,
    },
    {
      id: 9,
      sender: 'Maria Lopez',
      subject: 'Exam Schedule Conflict',
      preview: 'I have a scheduling conflict with the midterm...',
      course: 'History',
      time: '1 week ago',
      priority: 'high',
      hasAttachment: false,
      avatar: '/api/placeholder/32/32',
      isUnread: true,
    },
    {
      id: 10,
      sender: 'Kevin Chang',
      subject: 'Technical Issues with Portal',
      preview: "I'm experiencing login issues with the student...",
      course: 'IT Support',
      time: '1 week ago',
      priority: 'high',
      hasAttachment: true,
      avatar: '/api/placeholder/32/32',
      isUnread: false,
    },
    {
      id: 11,
      sender: 'Sophie Brown',
      subject: 'Internship Recommendation Letter',
      preview: 'Would you be able to write a recommendation...',
      course: 'Career Services',
      time: '2 weeks ago',
      priority: 'normal',
      hasAttachment: false,
      avatar: '/api/placeholder/32/32',
      isUnread: false,
    },
    {
      id: 12,
      sender: 'Alex Turner',
      subject: 'Course Withdrawal Question',
      preview: 'I need to discuss the implications of withdrawing...',
      course: 'Academic Advising',
      time: '2 weeks ago',
      priority: 'high',
      hasAttachment: false,
      avatar: '/api/placeholder/32/32',
      isUnread: false,
    },
    {
      id: 13,
      sender: 'Rachel Green',
      subject: 'Study Group Formation',
      preview: 'Several students are interested in forming...',
      course: 'Statistics',
      time: '2 weeks ago',
      priority: 'normal',
      hasAttachment: false,
      avatar: '/api/placeholder/32/32',
      isUnread: false,
    },
    {
      id: 14,
      sender: 'Tom Wilson',
      subject: 'Lab Equipment Malfunction',
      preview: 'The microscope in lab room 204 is not working...',
      course: 'Biology',
      time: '3 weeks ago',
      priority: 'high',
      hasAttachment: true,
      avatar: '/api/placeholder/32/32',
      isUnread: false,
    },
    {
      id: 15,
      sender: 'Jennifer Davis',
      subject: 'Guest Lecture Confirmation',
      preview: 'Thank you for confirming the guest lecture...',
      course: 'Economics',
      time: '3 weeks ago',
      priority: 'normal',
      hasAttachment: false,
      avatar: '/api/placeholder/32/32',
      isUnread: false,
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="h-screen rounded-none border-r">
      <CardContent className="flex h-full flex-col p-0">
        <div className="sticky top-0 z-10 border-b p-4">
          <div className="space-y-4">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input placeholder="Search messages..." className="pl-10" />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="h-8">
                All Messages
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                All Priority
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                All Courses
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-0">
            {messages.map((message, index) => (
              <div key={message.id}>
                <Card
                  className={`hover:bg-muted/50 cursor-pointer rounded-none border-0 border-l-4 transition-colors ${
                    message.priority === 'high'
                      ? 'border-l-destructive'
                      : 'border-l-primary'
                  } ${message.isUnread ? 'bg-primary/5' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={message.avatar}
                            alt={message.sender}
                          />
                          <AvatarFallback className="text-sm">
                            {getInitials(message.sender)}
                          </AvatarFallback>
                        </Avatar>
                        {message.isUnread && (
                          <div className="bg-primary absolute -top-1 -right-1 h-3 w-3 rounded-full" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3
                            className={`truncate text-sm ${
                              message.isUnread ? 'font-semibold' : 'font-medium'
                            }`}
                          >
                            {message.sender}
                          </h3>
                          {message.priority === 'high' && (
                            <Badge
                              variant="destructive"
                              className="h-5 text-xs"
                            >
                              High
                            </Badge>
                          )}
                        </div>

                        <p
                          className={`truncate text-sm ${
                            message.isUnread
                              ? 'text-foreground font-medium'
                              : 'text-foreground'
                          }`}
                        >
                          {message.subject}
                        </p>

                        <p className="text-muted-foreground truncate text-xs">
                          {message.preview}
                        </p>

                        <div className="flex items-center justify-between pt-1">
                          <Badge variant="secondary" className="h-5 text-xs">
                            {message.course}
                          </Badge>
                          <div className="text-muted-foreground flex items-center gap-2 text-xs">
                            <span>{message.time}</span>
                            {message.hasAttachment && (
                              <Paperclip className="h-3 w-3" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {index < messages.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MessageListSidebar;
