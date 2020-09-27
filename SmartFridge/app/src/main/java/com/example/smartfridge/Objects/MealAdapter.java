package com.example.smartfridge.Objects;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.smartfridge.R;

public class MealAdapter extends RecyclerView.Adapter<MealAdapter. ViewHolder> {
    MealData[] mealData;

    public MealAdapter(MealData[] mealData) {
        this.mealData = mealData;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater layoutInflater = LayoutInflater.from(parent.getContext());
        View view = layoutInflater.inflate(R.layout.meal_list, parent, false);
        ViewHolder viewHolder = new ViewHolder(view);
        return viewHolder;
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        final MealData mealDataList = mealData[position];
        holder.textMealName.setText(mealDataList.getMealName());
        holder.textMealDescp.setText(mealDataList.getMealDescription());
        holder.mealImage.setImageResource(mealDataList.getMealImage());
    }

    @Override
    public int getItemCount() {
        return mealData.length;
    }

    public class ViewHolder extends RecyclerView.ViewHolder{
        ImageView mealImage;
        TextView textMealName;
        TextView textMealDescp;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            mealImage = itemView.findViewById(R.id.mealImg);
            textMealName = itemView.findViewById(R.id.mealName);
            textMealDescp = itemView.findViewById(R.id.mealDescription);
        }
    }
}
