import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  FiInbox, FiStar, FiSend, FiTrash2, FiArchive, FiMail,
  FiSearch, FiRefreshCw, FiCheckSquare, FiSquare, FiCornerUpLeft,
  FiUser, FiPhone, FiCheckCircle, FiClock, FiPlus, FiX,
  FiTag, FiAlertCircle, FiChevronRight, FiPrinter, FiInfo,
  FiFileText, FiShield, FiExternalLink, FiCompass
} from 'react-icons/fi';
import { FaWhatsapp, FaSuitcase } from 'react-icons/fa';
import api from '../../api/axios.js';
import { useAuth } from '../../context/AuthContext.jsx';

const categoryLabels = {
  all: { label: 'All Inquiries', icon: FiMail, color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  student_registration: { label: 'Student Tour Signups', icon: FaSuitcase, color: 'bg-red-50 text-[#E11D48] dark:bg-red-950/40 dark:text-red-300 border-red-200 dark:border-red-900' },
  passport: { label: 'Passport & PSK Desk', icon: FiShield, color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-900' },
  booking: { label: 'Bookings & Ticketing', icon: FiCheckCircle, color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900' },
  support: { label: 'Support & Helpdesk', icon: FiAlertCircle, color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-900' },
  custom_tour: { label: 'Custom College Tours', icon: FiCompass, color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-900' },
};

const AdminInbox = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    inboxTotal: 0,
    unreadCount: 0,
    starredCount: 0,
    sentTotal: 0,
    trashTotal: 0,
    categories: {},
  });
  const [templates, setTemplates] = useState([]);

  // Filters & State
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'unread', 'starred'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [checkedIds, setCheckedIds] = useState([]);

  // Compose / Reply State
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [composeForm, setComposeForm] = useState({
    toEmail: '',
    toName: '',
    subject: '',
    category: 'student_registration',
    body: '',
  });
  const [sendingEmail, setSendingEmail] = useState(false);

  // Fetch Stats & Templates
  const fetchStats = async () => {
    try {
      const { data } = await api.get('/inbox/stats');
      if (data?.stats) setStats(data.stats);
    } catch {
      // ignore
    }
  };

  const fetchTemplates = async () => {
    try {
      const { data } = await api.get('/inbox/templates');
      if (data?.data) setTemplates(data.data);
    } catch {
      // ignore
    }
  };

  // Fetch Message List
  const fetchMessages = async (keepSelection = true) => {
    setLoading(true);
    try {
      const params = {
        folder: selectedFolder,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        search: searchQuery.trim() || undefined,
      };

      const { data } = await api.get('/inbox', { params });
      const fetched = data?.data || [];
      setMessages(fetched);

      if (keepSelection && selectedMessage) {
        const found = fetched.find((m) => m._id === selectedMessage._id);
        if (found) setSelectedMessage(found);
      } else if (!keepSelection && fetched.length > 0) {
        handleSelectMessage(fetched[0]);
      } else if (fetched.length === 0) {
        setSelectedMessage(null);
      }
    } catch {
      toast.error('Failed to load email inbox');
    } finally {
      setLoading(false);
      fetchStats();
    }
  };

  useEffect(() => {
    fetchStats();
    fetchTemplates();
  }, []);

  useEffect(() => {
    fetchMessages(false);
    setCheckedIds([]);
  }, [selectedFolder, selectedCategory, filterStatus]);

  // Select a message and mark read
  const handleSelectMessage = async (msg) => {
    setSelectedMessage(msg);
    setReplyText('');

    if (!msg.isRead) {
      try {
        await api.patch(`/inbox/${msg._id}/status`, { isRead: true });
        setMessages((prev) =>
          prev.map((m) => (m._id === msg._id ? { ...m, isRead: true } : m))
        );
        fetchStats();
      } catch {
        // silent fail
      }
    }
  };

  // Toggle Star
  const handleToggleStar = async (e, msg) => {
    e.stopPropagation();
    const newStarred = !msg.isStarred;
    try {
      await api.patch(`/inbox/${msg._id}/status`, { isStarred: newStarred });
      setMessages((prev) =>
        prev.map((m) => (m._id === msg._id ? { ...m, isStarred: newStarred } : m))
      );
      if (selectedMessage?._id === msg._id) {
        setSelectedMessage((prev) => ({ ...prev, isStarred: newStarred }));
      }
      fetchStats();
      toast.success(newStarred ? 'Starred message' : 'Removed from Starred');
    } catch {
      toast.error('Could not update star status');
    }
  };

  // Move to Trash / Delete
  const handleDeleteMessage = async (e, msg) => {
    if (e) e.stopPropagation();
    const isTrashFolder = selectedFolder === 'trash' || msg.isTrash;

    if (isTrashFolder && !window.confirm('Permanently delete this email?')) {
      return;
    }

    try {
      await api.delete(`/inbox/${msg._id}${isTrashFolder ? '?permanent=true' : ''}`);
      setMessages((prev) => prev.filter((m) => m._id !== msg._id));
      if (selectedMessage?._id === msg._id) {
        setSelectedMessage(null);
      }
      fetchStats();
      toast.success(isTrashFolder ? 'Message deleted permanently' : 'Moved to Trash');
    } catch {
      toast.error('Failed to delete message');
    }
  };

  // Batch Selection
  const handleSelectAll = () => {
    if (checkedIds.length === messages.length) {
      setCheckedIds([]);
    } else {
      setCheckedIds(messages.map((m) => m._id));
    }
  };

  const handleToggleCheck = (id) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBatchAction = async (action) => {
    if (checkedIds.length === 0) return;
    try {
      await api.post('/inbox/batch', { ids: checkedIds, action });
      toast.success(`Batch action applied to ${checkedIds.length} emails`);
      setCheckedIds([]);
      fetchMessages(true);
    } catch {
      toast.error('Failed to perform batch action');
    }
  };

  // Quick Template Selection in Reply
  const handleApplyTemplateToReply = (templateId) => {
    const tmpl = templates.find((t) => t.id === templateId);
    if (!tmpl || !selectedMessage) return;

    let text = tmpl.bodyText;
    const studentName = selectedMessage.sender?.name || selectedMessage.meta?.studentName || 'Student';
    const packageTitle = selectedMessage.meta?.packageTitle || 'Your Selected Tour';
    const destination = selectedMessage.meta?.destination || 'North India Tour';

    text = text
      .replace(/{studentName}/g, studentName)
      .replace(/{packageTitle}/g, packageTitle)
      .replace(/{destination}/g, destination);

    setReplyText(text);
  };

  // Send Thread Reply
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedMessage) {
      toast.error('Please type a reply message before sending.');
      return;
    }

    setSendingReply(true);
    try {
      const res = await api.post(`/inbox/${selectedMessage._id}/reply`, {
        replyText: replyText.trim(),
        senderName: user?.name || 'PCTE Travel Operations Desk',
      });

      toast.success(`Reply dispatched to ${selectedMessage.sender.email}`);
      const updatedReplies = [...(selectedMessage.replies || []), res.data.reply];
      setSelectedMessage((prev) => ({ ...prev, replies: updatedReplies }));
      setReplyText('');
      fetchMessages(true);
    } catch {
      toast.error('Failed to dispatch reply. Please try again.');
    } finally {
      setSendingReply(false);
    }
  };

  // Compose & Send New Email
  const handleSendNewEmail = async (e) => {
    e.preventDefault();
    if (!composeForm.toEmail || !composeForm.subject || !composeForm.body) {
      toast.error('Please fill in all required email fields.');
      return;
    }

    setSendingEmail(true);
    try {
      await api.post('/inbox/send', {
        toEmail: composeForm.toEmail,
        toName: composeForm.toName,
        subject: composeForm.subject,
        body: composeForm.body,
        category: composeForm.category,
      });

      toast.success(`Email dispatched to ${composeForm.toEmail}`);
      setShowComposeModal(false);
      setComposeForm({
        toEmail: '',
        toName: '',
        subject: '',
        category: 'student_registration',
        body: '',
      });
      fetchStats();
      if (selectedFolder === 'sent') fetchMessages(false);
    } catch {
      toast.error('Failed to send email. Please check network/credentials.');
    } finally {
      setSendingEmail(false);
    }
  };

  // Format Date / Relative
  const formatTimestamp = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = (now - date) / (1000 * 60 * 60);

    if (diffHours < 1) {
      const mins = Math.max(1, Math.floor((now - date) / (1000 * 60)));
      return `${mins}m ago`;
    }
    if (diffHours < 24) {
      return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    }
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-105px)] space-y-4">
      
      {/* ============================================================ */}
      {/* 1. TOP TITLE & ACTION BAR                                    */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="rounded bg-[#E11D48] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
              Email Dispatch Hub
            </span>
            <span className="text-xs text-slate-400 font-bold">
              {stats.unreadCount} Unread Messages
            </span>
          </div>
          <h1 className="font-display text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FiInbox className="text-[#E11D48]" /> Operations Mailbox &amp; Dispatcher
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Unified communications desk for student registrations, passport requests, and official email replies.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchMessages(true)}
            title="Refresh Mailbox"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F1D30] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} size={15} />
          </button>

          <button
            onClick={() => setShowComposeModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] hover:from-[#BE123C] hover:to-[#9B1C1C] text-white px-4 py-2 text-xs font-black shadow-md shadow-red-950/20 transition-all hover:scale-105"
          >
            <FiPlus size={16} />
            <span>Compose Email</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. THREE-PANE EMAIL CLIENT LAYOUT                            */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-[220px_360px_1fr] gap-4 flex-1 min-h-0 overflow-hidden">
        
        {/* ========================================================== */}
        {/* PANE 1: FOLDERS & CATEGORIES NAVIGATION                    */}
        {/* ========================================================== */}
        <div className="hidden lg:flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-3 shadow-sm overflow-y-auto">
          <div className="space-y-4">
            
            {/* Standard Mailbox Folders */}
            <div>
              <span className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                Mailboxes
              </span>
              <div className="space-y-1">
                {[
                  { id: 'inbox', label: 'Inbox', icon: FiInbox, badge: stats.unreadCount, color: 'text-blue-500' },
                  { id: 'starred', label: 'Starred', icon: FiStar, badge: stats.starredCount, color: 'text-amber-400' },
                  { id: 'sent', label: 'Sent Mail', icon: FiSend, badge: stats.sentTotal, color: 'text-emerald-500' },
                  { id: 'archived', label: 'Archived', icon: FiArchive, color: 'text-slate-400' },
                  { id: 'trash', label: 'Trash', icon: FiTrash2, badge: stats.trashTotal, color: 'text-red-400' },
                ].map((f) => {
                  const Icon = f.icon;
                  const isActive = selectedFolder === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => {
                        setSelectedFolder(f.id);
                        setSelectedCategory('all');
                      }}
                      className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#0F2942] text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={15} className={isActive ? 'text-white' : f.color} />
                        <span>{f.label}</span>
                      </div>
                      {f.badge > 0 && (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                          isActive
                            ? 'bg-[#E11D48] text-white'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                          {f.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Travel Inquiry Categories */}
            <div>
              <span className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                Categories
              </span>
              <div className="space-y-1">
                {Object.entries(categoryLabels).map(([key, cat]) => {
                  const Icon = cat.icon;
                  const isActive = selectedCategory === key;
                  const catCount = stats.categories?.[key] || 0;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedCategory(key);
                        if (selectedFolder !== 'inbox') setSelectedFolder('inbox');
                      }}
                      className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-red-50 text-[#E11D48] dark:bg-red-950/40 dark:text-red-300 font-black'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Icon size={14} className={isActive ? 'text-[#E11D48]' : 'text-slate-400'} />
                        <span className="truncate">{cat.label}</span>
                      </div>
                      {key !== 'all' && catCount > 0 && (
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          {catCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Mail Server Status Footer */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Nodemailer SMTP Ready</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Real emails dispatched directly to Gmail/student inboxes.
            </p>
          </div>
        </div>

        {/* ========================================================== */}
        {/* PANE 2: EMAIL MESSAGE STREAM / LIST                        */}
        {/* ========================================================== */}
        <div className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] shadow-sm overflow-hidden min-h-0">
          
          {/* Search & Filter Bar */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 space-y-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchMessages(true)}
                placeholder="Search mail, student, roll no..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 pl-9 pr-4 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#E11D48]"
              />
            </div>

            {/* Quick Status Filters & Batch Actions */}
            <div className="flex items-center justify-between gap-1 text-xs">
              <div className="flex items-center gap-1">
                <button
                  onClick={handleSelectAll}
                  title="Select All"
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {checkedIds.length > 0 && checkedIds.length === messages.length ? (
                    <FiCheckSquare className="text-[#E11D48]" size={15} />
                  ) : (
                    <FiSquare size={15} />
                  )}
                </button>

                {checkedIds.length > 0 ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleBatchAction('markRead')}
                      className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold"
                    >
                      Read
                    </button>
                    <button
                      onClick={() => handleBatchAction('star')}
                      className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold"
                    >
                      Star
                    </button>
                    <button
                      onClick={() => handleBatchAction('trash')}
                      className="px-2 py-1 rounded bg-red-50 text-red-600 dark:bg-red-950/40 text-[10px] font-bold"
                    >
                      Trash
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    {['all', 'unread', 'starred'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setFilterStatus(st)}
                        className={`rounded-lg px-2 py-1 text-[10px] font-extrabold capitalize transition ${
                          filterStatus === st
                            ? 'bg-[#0F2942] text-white dark:bg-white dark:text-[#0F2942]'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <span className="text-[10px] font-mono text-slate-400">
                {messages.length} msgs
              </span>
            </div>
          </div>

          {/* Message List Stream */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
            {loading ? (
              <div className="py-16 text-center">
                <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-[#E11D48] border-t-transparent" />
                <p className="mt-2 text-[11px] text-slate-400 font-bold uppercase">Loading Mail...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="py-16 text-center p-4">
                <FiMail className="mx-auto text-3xl text-slate-300 dark:text-slate-700 mb-2" />
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400">No messages found</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Try choosing a different folder or clearing search filters.</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isSelected = selectedMessage?._id === msg._id;
                const isChecked = checkedIds.includes(msg._id);
                const categoryStyle = categoryLabels[msg.category]?.color || 'bg-slate-100 text-slate-700';
                const initial = msg.sender?.name ? msg.sender.name.charAt(0).toUpperCase() : 'U';

                return (
                  <div
                    key={msg._id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`group relative p-3.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-red-50/70 dark:bg-red-950/20 border-l-4 border-[#E11D48]'
                        : !msg.isRead
                        ? 'bg-white dark:bg-[#0F1D30] font-bold border-l-4 border-transparent'
                        : 'bg-slate-50/40 dark:bg-[#0A1626]/40 opacity-80 border-l-4 border-transparent hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      
                      {/* Checkbox or Initial Avatar */}
                      <div className="shrink-0 flex items-center gap-1.5 pt-0.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleToggleCheck(msg._id);
                          }}
                          className="h-3.5 w-3.5 rounded border-slate-300 accent-[#E11D48] cursor-pointer"
                        />
                        <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-[#0F2942] to-[#1E3A8A] text-white flex items-center justify-center text-[10px] font-black shadow-sm">
                          {initial}
                        </div>
                      </div>

                      {/* Content Overview */}
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className={`text-xs truncate ${!msg.isRead ? 'font-black text-slate-900 dark:text-white' : 'font-bold text-slate-700 dark:text-slate-300'}`}>
                              {msg.sender?.name || 'Student / Traveler'}
                            </span>
                            {msg.sender?.role === 'student' && (
                              <span className="shrink-0 rounded bg-red-100 dark:bg-red-950/60 text-[#E11D48] dark:text-red-300 px-1 py-0.2 text-[8px] font-extrabold uppercase">
                                Student
                              </span>
                            )}
                          </div>
                          
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">
                            {formatTimestamp(msg.createdAt)}
                          </span>
                        </div>

                        {/* Subject */}
                        <div className={`text-xs truncate ${!msg.isRead ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                          {msg.subject}
                        </div>

                        {/* Body snippet */}
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 leading-snug">
                          {msg.bodyText}
                        </p>

                        {/* Badges & Actions */}
                        <div className="flex items-center justify-between pt-1">
                          <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${categoryStyle}`}>
                            {categoryLabels[msg.category]?.label || 'General'}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => handleToggleStar(e, msg)}
                              title={msg.isStarred ? 'Unstar' : 'Star'}
                              className="p-1 rounded text-slate-400 hover:text-amber-400 transition"
                            >
                              <FiStar size={14} className={msg.isStarred ? 'text-amber-400 fill-amber-400' : ''} />
                            </button>
                            <button
                              onClick={(e) => handleDeleteMessage(e, msg)}
                              title="Delete"
                              className="p-1 rounded text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                            >
                              <FiTrash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* ========================================================== */}
        {/* PANE 3: EMAIL THREAD WORKSPACE & REPLY                     */}
        {/* ========================================================== */}
        <div className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] shadow-sm overflow-hidden min-h-0">
          {selectedMessage ? (
            <div className="flex flex-col h-full overflow-hidden">
              
              {/* Message Header */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 shrink-0 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                        categoryLabels[selectedMessage.category]?.color || 'bg-slate-100 text-slate-700'
                      }`}>
                        {categoryLabels[selectedMessage.category]?.label || 'General Inquiry'}
                      </span>
                      {selectedMessage.tags?.map((t) => (
                        <span key={t} className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <h2 className="font-display text-lg font-black text-slate-900 dark:text-white leading-snug">
                      {selectedMessage.subject}
                    </h2>
                  </div>

                  {/* Header Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={(e) => handleToggleStar(e, selectedMessage)}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                      title={selectedMessage.isStarred ? 'Unstar' : 'Star'}
                    >
                      <FiStar size={16} className={selectedMessage.isStarred ? 'text-amber-400 fill-amber-400' : ''} />
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                      title="Print / Save PDF"
                    >
                      <FiPrinter size={16} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteMessage(e, selectedMessage)}
                      className="p-2 rounded-xl border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                      title="Delete / Move to Trash"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Sender Identity Card */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-[#070D18] p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#0F2942] text-white flex items-center justify-center font-black text-sm uppercase shadow">
                      {selectedMessage.sender?.name ? selectedMessage.sender.name.charAt(0) : 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {selectedMessage.sender?.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          &lt;{selectedMessage.sender?.email}&gt;
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <span>To: {selectedMessage.recipient?.name || 'PCTE Travel Desk'}</span>
                        <span>•</span>
                        <span>{new Date(selectedMessage.createdAt).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Student Quick Action Buttons */}
                  {selectedMessage.meta?.phone && (
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${selectedMessage.meta.phone}`}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F1D30] px-2.5 py-1 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-[#0F2942]"
                      >
                        <FiPhone size={12} className="text-blue-500" />
                        <span>{selectedMessage.meta.phone}</span>
                      </a>
                      <a
                        href={`https://wa.me/91${selectedMessage.meta.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hello ${selectedMessage.sender.name}, regarding your inquiry for ${selectedMessage.subject} at PCTE Travels.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition"
                      >
                        <FaWhatsapp size={13} />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Scrollable Message Body & Discussion History */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                
                {/* Student Registration / Tour Highlight Card if available */}
                {selectedMessage.meta?.packageTitle && (
                  <div className="rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-[#E11D48] tracking-wider">
                        Linked Tour Package Details
                      </span>
                      {selectedMessage.meta.tourPrice && (
                        <span className="font-mono font-black text-xs text-[#E11D48]">
                          {selectedMessage.meta.tourPrice}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {selectedMessage.meta.packageTitle}
                    </h4>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-300">
                      {selectedMessage.meta.rollNumber && (
                        <div>Roll No: <b className="text-slate-900 dark:text-white font-mono">{selectedMessage.meta.rollNumber}</b></div>
                      )}
                      {selectedMessage.meta.course && (
                        <div>Course: <b className="text-slate-900 dark:text-white">{selectedMessage.meta.course}</b></div>
                      )}
                      {selectedMessage.meta.destination && (
                        <div>Destination: <b className="text-slate-900 dark:text-white">{selectedMessage.meta.destination}</b></div>
                      )}
                    </div>
                  </div>
                )}

                {/* Primary Message Content */}
                <div className="prose dark:prose-invert max-w-none text-xs md:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedMessage.bodyText}
                </div>

                {/* Conversation Thread / Previous Replies */}
                {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="font-display text-xs font-black uppercase tracking-wider text-slate-400">
                      Thread Replies &amp; Dispatches ({selectedMessage.replies.length})
                    </h4>
                    
                    {selectedMessage.replies.map((rep, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs border-b border-emerald-200/60 dark:border-emerald-900/40 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-emerald-800 dark:text-emerald-300">
                              {rep.sender?.name || 'PCTE Travel Desk'}
                            </span>
                            <span className="rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 px-1.5 py-0.2 text-[9px] font-bold uppercase">
                              Official Reply
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(rep.createdAt).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                          {rep.message}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>

              {/* Quick Reply Box with Canned Templates */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070D18] shrink-0 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <FiCornerUpLeft className="text-[#E11D48]" /> Reply to {selectedMessage.sender?.name}
                  </span>

                  {/* 1-Click Canned Travel Templates */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400">⚡ Canned Template:</span>
                    <select
                      onChange={(e) => {
                        if (e.target.value) handleApplyTemplateToReply(e.target.value);
                      }}
                      defaultValue=""
                      className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F1D30] text-[11px] font-bold px-2 py-1 text-slate-700 dark:text-slate-200 outline-none"
                    >
                      <option value="" disabled>Choose template to auto-fill...</option>
                      {templates.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <form onSubmit={handleSendReply} className="space-y-2">
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your official email response here... (Dispatches real email to recipient)"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F1D30] p-3 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      Dispatched via SMTP to <b>{selectedMessage.sender?.email}</b>
                    </span>

                    <button
                      type="submit"
                      disabled={sendingReply || !replyText.trim()}
                      className="flex items-center gap-1.5 rounded-xl bg-[#0F2942] hover:bg-[#E11D48] text-white px-5 py-2 text-xs font-black shadow transition disabled:opacity-50"
                    >
                      <FiSend size={13} className={sendingReply ? 'animate-bounce' : ''} />
                      <span>{sendingReply ? 'Dispatching...' : 'Send Official Email'}</span>
                    </button>
                  </div>
                </form>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-3">
              <div className="h-16 w-16 rounded-3xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center text-slate-400">
                <FiMail size={32} />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-slate-800 dark:text-slate-200">
                  Select a message to view conversation
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Choose an email from the list on the left to read inquiries, review student details, and send official replies.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ============================================================ */}
      {/* 3. COMPOSE EMAIL POPUP MODAL                                 */}
      {/* ============================================================ */}
      {showComposeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleSendNewEmail}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white dark:bg-[#0F1D30] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-slate-900 dark:text-white"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#E11D48] text-white flex items-center justify-center">
                  <FiSend size={16} />
                </div>
                <div>
                  <h3 className="font-display text-base font-black">Compose New Email</h3>
                  <p className="text-[10px] text-slate-400">Direct SMTP Outbound Dispatcher</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowComposeModal(false)}
                className="rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-xs font-bold"
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              
              {/* Recipient Email & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">To Email Address *</label>
                  <input
                    required
                    type="email"
                    placeholder="e.g. student@pcte.edu.in"
                    value={composeForm.toEmail}
                    onChange={(e) => setComposeForm((p) => ({ ...p, toEmail: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 outline-none focus:border-[#E11D48]"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Recipient Name</label>
                  <input
                    placeholder="e.g. Rohit Sharma"
                    value={composeForm.toName}
                    onChange={(e) => setComposeForm((p) => ({ ...p, toName: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 outline-none focus:border-[#E11D48]"
                  />
                </div>
              </div>

              {/* Category & Template Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Category</label>
                  <select
                    value={composeForm.category}
                    onChange={(e) => setComposeForm((p) => ({ ...p, category: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 outline-none"
                  >
                    <option value="student_registration">Student Tour Signup</option>
                    <option value="passport">Passport &amp; PSK Desk</option>
                    <option value="booking">Booking &amp; Ticketing</option>
                    <option value="custom_tour">Custom College Tour</option>
                    <option value="support">Support &amp; General</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Auto-Fill from Template</label>
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      const tmpl = templates.find((t) => t.id === e.target.value);
                      if (tmpl) {
                        setComposeForm((p) => ({
                          ...p,
                          subject: tmpl.subject.replace('{packageTitle}', 'Selected Tour'),
                          body: tmpl.bodyText.replace(/{studentName}/g, composeForm.toName || 'Student'),
                          category: tmpl.category || p.category,
                        }));
                      }
                    }}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 outline-none"
                  >
                    <option value="" disabled>Select template to load...</option>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="font-bold block mb-1">Subject Line *</label>
                <input
                  required
                  placeholder="e.g. Seat Allocation Notice for Manali Batch Tour"
                  value={composeForm.subject}
                  onChange={(e) => setComposeForm((p) => ({ ...p, subject: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 outline-none focus:border-[#E11D48]"
                />
              </div>

              {/* Body */}
              <div>
                <label className="font-bold block mb-1">Email Body *</label>
                <textarea
                  required
                  rows={7}
                  placeholder="Write your email contents here..."
                  value={composeForm.body}
                  onChange={(e) => setComposeForm((p) => ({ ...p, body: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 outline-none focus:border-[#E11D48] leading-relaxed font-sans"
                />
              </div>

            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400">
                From: <b>PCTE Travel Hub</b> &lt;support@pctetravels.com&gt;
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowComposeModal(false)}
                  className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingEmail}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#9B1C1C] hover:from-[#BE123C] hover:to-[#7F1D1D] text-white px-5 py-2 text-xs font-black shadow transition disabled:opacity-50"
                >
                  <FiSend size={14} className={sendingEmail ? 'animate-spin' : ''} />
                  <span>{sendingEmail ? 'Dispatching...' : 'Send Outbound Email'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default AdminInbox;
