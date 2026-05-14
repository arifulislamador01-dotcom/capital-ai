'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { Star, ThumbsUp, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Review {
  id: string;
  user_name: string;
  tool_used: string;
  rating: number;
  review_text: string;
  created_at: string;
  helpful_count: number;
}

export function ReviewSystem({ toolName }: { toolName?: string }) {
  const { user } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [selectedTool, setSelectedTool] = useState(toolName || 'General');

  useEffect(() => {
    fetchReviews();
  }, [toolName]);

  const fetchReviews = async () => {
    try {
      let query = supabase.from('reviews').select('*').eq('is_approved', true).order('created_at', { ascending: false });
      if (toolName) {
        query = query.eq('tool_used', toolName);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('রিভিউ দিতে লগইন করুন');
      return;
    }
    if (reviewText.length < 20) {
      toast.error('রিভিউ কমপক্ষে ২০ অক্ষরের হতে হবে');
      return;
    }

    try {
      const { error } = await supabase.from('reviews').insert([{
        user_id: user.id,
        user_name: user.fullName || user.primaryEmailAddress?.emailAddress?.split('@')[0] || 'User',
        tool_used: selectedTool,
        rating,
        review_text: reviewText,
        is_approved: false
      }]);

      if (error) throw error;
      
      toast.success('ধন্যবাদ! আপনার রিভিউটি এডমিন এপ্রুভালের জন্য পাঠানো হয়েছে।');
      setShowForm(false);
      setReviewText('');
    } catch (error) {
      toast.error('রিভিউ সাবমিট করতে সমস্যা হয়েছে');
    }
  };

  const markHelpful = async (id: string, currentCount: number) => {
    try {
      const { error } = await supabase.from('reviews')
        .update({ helpful_count: currentCount + 1 })
        .eq('id', id);
        
      if (!error) {
        setReviews(reviews.map(r => r.id === id ? { ...r, helpful_count: currentCount + 1 } : r));
        toast.success('ধন্যবাদ!');
      }
    } catch (e) {}
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="text-cyan-400" /> ব্যবহারকারীদের মতামত
        </h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors shadow-[0_0_15px_rgba(123,47,190,0.5)]"
        >
          রিভিউ দিন
        </button>
      </div>

      {showForm && (
        <form onSubmit={submitReview} className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 mb-8 backdrop-blur-sm">
          <div className="mb-4">
            <label className="block text-slate-300 mb-2">রেটিং</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="text-2xl focus:outline-none transition-transform hover:scale-110"
                >
                  <Star className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-600"} />
                </button>
              ))}
            </div>
          </div>

          {!toolName && (
            <div className="mb-4">
              <label className="block text-slate-300 mb-2">কোন টুলটি ব্যবহার করেছেন?</label>
              <input 
                type="text" 
                value={selectedTool}
                onChange={(e) => setSelectedTool(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                placeholder="যেমন: Image Generator"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-slate-300 mb-2">আপনার অভিজ্ঞতা লিখুন (কমপক্ষে ২০ অক্ষর)</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white h-24 focus:border-cyan-500 focus:outline-none"
              placeholder="আপনার মতামত আমাদের কাছে খুবই গুরুত্বপূর্ণ..."
              required
              minLength={20}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              বাতিল
            </button>
            <button 
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-6 py-2 rounded-lg transition-colors shadow-[0_0_15px_rgba(0,212,255,0.4)]"
            >
              সাবমিট করুন
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-8 text-slate-400">লোড হচ্ছে...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/30 rounded-xl border border-slate-800">
          <p className="text-slate-400">এখনো কোনো রিভিউ নেই। আপনিই প্রথম রিভিউ দিন!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors group">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-white font-medium">{review.user_name}</h4>
                  <p className="text-xs text-slate-500 mt-1">{new Date(review.created_at).toLocaleDateString('bn-BD')}</p>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-700"}`} />
                  ))}
                </div>
              </div>
              
              <div className="mb-3">
                <span className="inline-block px-2 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded-md border border-cyan-500/20">
                  {review.tool_used}
                </span>
              </div>
              
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                &quot;{review.review_text}&quot;
              </p>
              
              <div className="flex justify-end">
                <button 
                  onClick={() => markHelpful(review.id, review.helpful_count || 0)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  <ThumbsUp className="w-3 h-3" />
                  সহায়ক ({review.helpful_count || 0})
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
